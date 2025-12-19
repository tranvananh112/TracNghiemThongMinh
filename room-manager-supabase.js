// ============================================================================
// ROOM MANAGER - KẾT NỐI SUPABASE
// Quản lý phòng thi với Supabase - Mọi người có thể xem và tham gia
// ============================================================================

class SupabaseRoomManager {
    constructor() {
        this.supabase = null;
        this.tableName = 'exam_rooms';
        this.isAvailable = false;
        this.creatorId = this.getCreatorId();
        this.realtimeChannel = null;
        this.updateCallbacks = [];

        console.log('🏠 Supabase Room Manager initialized');
        console.log('🆔 Creator ID:', this.creatorId);
    }

    // Lấy hoặc tạo Creator ID
    getCreatorId() {
        let creatorId = localStorage.getItem('creatorId');
        if (!creatorId) {
            creatorId = 'creator_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('creatorId', creatorId);
            console.log('🆕 Created new Creator ID:', creatorId);
        }
        return creatorId;
    }

    // Khởi tạo kết nối Supabase
    async initialize() {
        try {
            // Đợi supabase-config.js load xong
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                this.supabase = window.supabaseQuizManager.supabase;
                this.isAvailable = true;
                console.log('✅ Supabase Room Manager connected');

                // Bật realtime
                this.enableRealtime();

                return true;
            } else {
                console.warn('⚠️ Supabase not available for rooms');
                return false;
            }
        } catch (error) {
            console.error('❌ Error initializing Supabase Room Manager:', error);
            return false;
        }
    }

    // Kiểm tra Supabase có sẵn sàng không
    checkAvailable() {
        if (!this.isAvailable) {
            throw new Error('Supabase không khả dụng. Vui lòng kiểm tra cấu hình.');
        }
    }

    // ============================================================================
    // TẠO PHÒNG THI
    // ============================================================================
    async createRoom(roomData) {
        this.checkAvailable();

        try {
            const room = {
                name: roomData.name,
                code: roomData.code,
                description: roomData.description || '',
                quiz_data: roomData.quizData,
                creator_name: roomData.creatorName,
                creator_id: this.creatorId,
                participants: 0,
                attempts: 0,
                leaderboard: []
            };

            console.log('📤 Creating room in Supabase:', room.name);

            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([room])
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Room created successfully:', data.id);

            return {
                success: true,
                room: this.formatRoom(data)
            };
        } catch (error) {
            console.error('❌ Error creating room:', error);
            throw error;
        }
    }

    // ============================================================================
    // LẤY TẤT CẢ PHÒNG THI (Mọi người có thể xem)
    // ============================================================================
    async getAllRooms(limit = 50) {
        this.checkAvailable();

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                throw error;
            }

            const rooms = data.map(room => this.formatRoom(room));

            console.log(`📋 Loaded ${rooms.length} rooms from Supabase`);

            return {
                success: true,
                rooms: rooms
            };
        } catch (error) {
            console.error('❌ Error getting rooms:', error);
            throw error;
        }
    }

    // ============================================================================
    // LẤY PHÒNG CỦA TÔI (Theo creator_id)
    // ============================================================================
    async getMyRooms() {
        this.checkAvailable();

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('creator_id', this.creatorId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const rooms = data.map(room => this.formatRoom(room));

            console.log(`📋 Loaded ${rooms.length} of my rooms`);

            return {
                success: true,
                rooms: rooms
            };
        } catch (error) {
            console.error('❌ Error getting my rooms:', error);
            throw error;
        }
    }

    // ============================================================================
    // TÌM PHÒNG BẰNG MÃ
    // ============================================================================
    async getRoomByCode(code) {
        this.checkAvailable();

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('code', code)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new Error('Không tìm thấy phòng với mã này');
                }
                throw error;
            }

            console.log('✅ Found room:', data.name);

            return {
                success: true,
                room: this.formatRoom(data)
            };
        } catch (error) {
            console.error('❌ Error finding room:', error);
            throw error;
        }
    }

    // ============================================================================
    // CẬP NHẬT SỐ NGƯỜI THAM GIA
    // ============================================================================
    async incrementParticipants(roomId) {
        this.checkAvailable();

        try {
            // Lấy số người tham gia hiện tại
            const { data: currentData, error: selectError } = await this.supabase
                .from(this.tableName)
                .select('participants')
                .eq('id', roomId)
                .single();

            if (selectError) {
                throw selectError;
            }

            const newParticipants = (currentData.participants || 0) + 1;

            // Cập nhật
            const { error: updateError } = await this.supabase
                .from(this.tableName)
                .update({ participants: newParticipants })
                .eq('id', roomId);

            if (updateError) {
                throw updateError;
            }

            console.log(`✅ Participants updated: ${newParticipants}`);

            return {
                success: true,
                participants: newParticipants
            };
        } catch (error) {
            console.error('❌ Error updating participants:', error);
            return { success: false };
        }
    }

    // ============================================================================
    // CẬP NHẬT SỐ LƯỢT LÀM BÀI
    // ============================================================================
    async incrementAttempts(roomId) {
        this.checkAvailable();

        try {
            const { data: currentData, error: selectError } = await this.supabase
                .from(this.tableName)
                .select('attempts')
                .eq('id', roomId)
                .single();

            if (selectError) {
                throw selectError;
            }

            const newAttempts = (currentData.attempts || 0) + 1;

            const { error: updateError } = await this.supabase
                .from(this.tableName)
                .update({ attempts: newAttempts })
                .eq('id', roomId);

            if (updateError) {
                throw updateError;
            }

            console.log(`✅ Attempts updated: ${newAttempts}`);

            return {
                success: true,
                attempts: newAttempts
            };
        } catch (error) {
            console.error('❌ Error updating attempts:', error);
            return { success: false };
        }
    }

    // ============================================================================
    // CẬP NHẬT BẢNG XẾP HẠNG
    // ============================================================================
    async updateLeaderboard(roomId, newEntry) {
        this.checkAvailable();

        try {
            // Lấy leaderboard hiện tại
            const { data: currentData, error: selectError } = await this.supabase
                .from(this.tableName)
                .select('leaderboard')
                .eq('id', roomId)
                .single();

            if (selectError) {
                throw selectError;
            }

            let leaderboard = currentData.leaderboard || [];

            // Thêm entry mới
            leaderboard.push({
                userName: newEntry.userName,
                score: newEntry.score,
                correctAnswers: newEntry.correctAnswers,
                totalQuestions: newEntry.totalQuestions,
                timeSpent: newEntry.timeSpent,
                completedAt: new Date().toISOString()
            });

            // Sắp xếp theo điểm cao nhất
            leaderboard.sort((a, b) => b.score - a.score);

            // Giới hạn top 100
            if (leaderboard.length > 100) {
                leaderboard = leaderboard.slice(0, 100);
            }

            // Cập nhật
            const { error: updateError } = await this.supabase
                .from(this.tableName)
                .update({ leaderboard: leaderboard })
                .eq('id', roomId);

            if (updateError) {
                throw updateError;
            }

            console.log('✅ Leaderboard updated');

            return {
                success: true,
                leaderboard: leaderboard
            };
        } catch (error) {
            console.error('❌ Error updating leaderboard:', error);
            return { success: false };
        }
    }

    // ============================================================================
    // XÓA PHÒNG
    // ============================================================================
    async deleteRoom(roomId) {
        this.checkAvailable();

        try {
            console.log('🗑️ Deleting room:', roomId);

            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('id', roomId);

            if (error) {
                throw error;
            }

            console.log('✅ Room deleted successfully');

            return {
                success: true,
                message: 'Phòng đã được xóa'
            };
        } catch (error) {
            console.error('❌ Error deleting room:', error);
            throw error;
        }
    }

    // ============================================================================
    // TÌM KIẾM PHÒNG
    // ============================================================================
    async searchRooms(keyword) {
        this.checkAvailable();

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%,creator_name.ilike.%${keyword}%`)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                throw error;
            }

            const rooms = data.map(room => this.formatRoom(room));

            return {
                success: true,
                rooms: rooms
            };
        } catch (error) {
            console.error('❌ Error searching rooms:', error);
            throw error;
        }
    }

    // ============================================================================
    // REALTIME - Lắng nghe thay đổi
    // ============================================================================
    enableRealtime() {
        if (!this.isAvailable) {
            console.warn('Supabase not available, cannot enable realtime');
            return;
        }

        // Hủy channel cũ nếu có
        if (this.realtimeChannel) {
            this.supabase.removeChannel(this.realtimeChannel);
        }

        // Tạo channel mới
        this.realtimeChannel = this.supabase
            .channel('exam_rooms_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: this.tableName
                },
                (payload) => {
                    console.log('📡 Realtime room update:', payload);
                    this.handleRealtimeUpdate(payload);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Realtime subscribed for rooms');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Realtime subscription error');
                }
            });
    }

    disableRealtime() {
        if (this.realtimeChannel) {
            this.supabase.removeChannel(this.realtimeChannel);
            this.realtimeChannel = null;
            console.log('🔌 Realtime disabled for rooms');
        }
    }

    handleRealtimeUpdate(payload) {
        if (payload.eventType === 'INSERT') {
            console.log('🆕 New room created:', payload.new.name);
        } else if (payload.eventType === 'UPDATE') {
            console.log('🔄 Room updated:', payload.new.name);
        } else if (payload.eventType === 'DELETE') {
            console.log('🗑️ Room deleted:', payload.old.id);
        }

        // Thông báo cho callbacks
        this.notifyUpdate({
            type: payload.eventType,
            room: payload.new || payload.old
        });
    }

    // Đăng ký callback
    onRoomUpdate(callback) {
        this.updateCallbacks.push(callback);
    }

    offRoomUpdate(callback) {
        this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    }

    notifyUpdate(data) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        });
    }

    // ============================================================================
    // HELPER - Format room data
    // ============================================================================
    formatRoom(data) {
        return {
            id: data.id,
            name: data.name,
            code: data.code,
            description: data.description,
            quizData: data.quiz_data,
            creatorName: data.creator_name,
            creatorId: data.creator_id,
            participants: data.participants || 0,
            attempts: data.attempts || 0,
            leaderboard: data.leaderboard || [],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isMyRoom: data.creator_id === this.creatorId
        };
    }
}

// Export
const supabaseRoomManager = new SupabaseRoomManager();
window.supabaseRoomManager = supabaseRoomManager;

export { supabaseRoomManager };
