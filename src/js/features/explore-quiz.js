// Explore Quiz Manager - Quản lý tính năng khám phá đề thi
class ExploreQuizManager {
    constructor() {
        // Tự động phát hiện server URL
        this.API_BASE_URL = this.detectServerURL();
        this.sharedQuizzes = [];
        this.currentUserName = localStorage.getItem('userName') || '';
        this.currentSharingQuizId = null;
        this.isServerOnline = false;
        this.offlineMode = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.serverInfo = null;
    }

    // Phát hiện URL server tự động
    detectServerURL() {
        // Lấy từ localStorage nếu đã lưu
        const savedServerURL = localStorage.getItem('serverURL');
        if (savedServerURL) {
            console.log('📌 Using saved server URL:', savedServerURL);
            return savedServerURL;
        }

        // Nếu đang chạy từ server (không phải file://)
        if (window.location.protocol !== 'file:') {
            const baseURL = `${window.location.protocol}//${window.location.hostname}:3000/api`;
            console.log('🌐 Detected server URL from location:', baseURL);
            return baseURL;
        }

        // Mặc định localhost
        console.log('🏠 Using default localhost URL');
        return 'http://localhost:3000/api';
    }

    // Lưu server URL
    saveServerURL(url) {
        this.API_BASE_URL = url;
        localStorage.setItem('serverURL', url);
        console.log('✅ Đã lưu Server URL:', url);
    }

    showServerURLDialog() {
        const currentURL = this.API_BASE_URL.replace('/api', '');

        const dialog = document.createElement('div');
        dialog.className = 'server-url-dialog';
        dialog.innerHTML = `
            <div class="server-url-content">
                <div class="server-url-header">
                    <h3><i class="fas fa-server"></i> Cấu Hình Server</h3>
                    <button class="btn-close" onclick="this.closest('.server-url-dialog').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="server-url-body">
                    <p><strong>Địa chỉ Server hiện tại:</strong></p>
                    <input type="text" id="server-url-input" value="${currentURL}" 
                           placeholder="http://192.168.1.100:3000" class="server-url-input">
                    
                    <div class="server-url-help">
                        <h4><i class="fas fa-info-circle"></i> Hướng dẫn:</h4>
                        <ul>
                            <li><strong>Trên máy chủ:</strong> http://localhost:3000</li>
                            <li><strong>Từ máy khác (LAN):</strong> http://[IP-máy-chủ]:3000</li>
                            <li><strong>Ví dụ:</strong> http://192.168.1.100:3000</li>
                        </ul>
                        
                        <div class="server-url-note">
                            <i class="fas fa-lightbulb"></i>
                            <p>Để xem IP của máy chủ, chạy server và xem console</p>
                        </div>
                    </div>

                    <div id="server-test-result"></div>
                </div>
                <div class="server-url-footer">
                    <button class="btn btn-primary" onclick="exploreQuizManager.testAndSaveServerURL()">
                        <i class="fas fa-check"></i> Kiểm Tra & Lưu
                    </button>
                    <button class="btn btn-secondary" onclick="exploreQuizManager.autoDetectServer()">
                        <i class="fas fa-search"></i> Tự Động Tìm
                    </button>
                    <button class="btn btn-danger" onclick="this.closest('.server-url-dialog').remove()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    // Test và lưu server URL
    async testAndSaveServerURL() {
        const input = document.getElementById('server-url-input');
        const resultDiv = document.getElementById('server-test-result');

        if (!input || !resultDiv) return;

        let serverURL = input.value.trim();

        // Validate URL
        if (!serverURL) {
            resultDiv.innerHTML = '<div class="test-error"><i class="fas fa-exclamation-triangle"></i> Vui lòng nhập địa chỉ server</div>';
            return;
        }

        // Thêm http:// nếu chưa có
        if (!serverURL.startsWith('http://') && !serverURL.startsWith('https://')) {
            serverURL = 'http://' + serverURL;
        }

        // Loại bỏ /api nếu có
        serverURL = serverURL.replace(/\/api\/?$/, '');

        resultDiv.innerHTML = '<div class="test-loading"><i class="fas fa-spinner fa-spin"></i> Đang kiểm tra kết nối...</div>';

        try {
            const testURL = `${serverURL}/api/server-info`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(testURL, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();

                resultDiv.innerHTML = `
                    <div class="test-success">
                        <i class="fas fa-check-circle"></i> 
                        <strong>Kết nối thành công!</strong>
                        <div class="server-info-details">
                            <p>Port: ${data.port}</p>
                            ${data.ipAddresses && data.ipAddresses.length > 0 ?
                        `<p>IP: ${data.ipAddresses.join(', ')}</p>` : ''}
                        </div>
                    </div>
                `;

                // Lưu URL
                this.saveServerURL(`${serverURL}/api`);
                this.serverInfo = data;
                this.isServerOnline = true;
                this.updateServerStatus(true);

                // Đóng dialog sau 2 giây
                setTimeout(() => {
                    document.querySelector('.server-url-dialog')?.remove();
                    quizManager.showToast('✅ Đã kết nối server thành công!', 'success');
                    this.loadSharedQuizzes();
                }, 2000);
            } else {
                throw new Error('Server không phản hồi đúng');
            }
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="test-error">
                    <i class="fas fa-times-circle"></i> 
                    <strong>Không thể kết nối!</strong>
                    <p>${error.message}</p>
                    <p>Vui lòng kiểm tra:</p>
                    <ul>
                        <li>Server đã chạy chưa?</li>
                        <li>Địa chỉ IP có đúng không?</li>
                        <li>Tường lửa có chặn không?</li>
                    </ul>
                </div>
            `;
        }
    }

    // Tự động tìm server trong mạng LAN
    async autoDetectServer() {
        const resultDiv = document.getElementById('server-test-result');
        if (!resultDiv) return;

        resultDiv.innerHTML = '<div class="test-loading"><i class="fas fa-spinner fa-spin"></i> Đang tìm kiếm server trong mạng...</div>';

        // Lấy IP hiện tại của máy
        const currentIP = await this.getCurrentIP();
        if (!currentIP) {
            resultDiv.innerHTML = '<div class="test-error"><i class="fas fa-times-circle"></i> Không thể xác định IP của máy</div>';
            return;
        }

        // Tạo danh sách IP để test (cùng subnet)
        const ipParts = currentIP.split('.');
        const subnet = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;

        const testIPs = [
            'localhost',
            '127.0.0.1',
            currentIP
        ];

        // Thêm một số IP phổ biến trong subnet
        for (let i = 1; i <= 10; i++) {
            testIPs.push(`${subnet}.${i}`);
        }

        resultDiv.innerHTML = `<div class="test-loading"><i class="fas fa-spinner fa-spin"></i> Đang kiểm tra ${testIPs.length} địa chỉ...</div>`;

        // Test từng IP
        for (const ip of testIPs) {
            try {
                const testURL = `http://${ip}:3000/api/server-info`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                const response = await fetch(testURL, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();

                    resultDiv.innerHTML = `
                        <div class="test-success">
                            <i class="fas fa-check-circle"></i> 
                            <strong>Tìm thấy server tại: ${ip}</strong>
                        </div>
                    `;

                    // Cập nhật input
                    const input = document.getElementById('server-url-input');
                    if (input) {
                        input.value = `http://${ip}:3000`;
                    }

                    // Lưu và kết nối
                    this.saveServerURL(`http://${ip}:3000/api`);
                    this.serverInfo = data;
                    this.isServerOnline = true;
                    this.updateServerStatus(true);

                    setTimeout(() => {
                        document.querySelector('.server-url-dialog')?.remove();
                        quizManager.showToast('✅ Đã tìm thấy và kết nối server!', 'success');
                        this.loadSharedQuizzes();
                    }, 2000);

                    return;
                }
            } catch (error) {
                // Tiếp tục test IP tiếp theo
                continue;
            }
        }

        resultDiv.innerHTML = `
            <div class="test-error">
                <i class="fas fa-times-circle"></i> 
                <strong>Không tìm thấy server nào</strong>
                <p>Vui lòng nhập địa chỉ thủ công</p>
            </div>
        `;
    }

    // Lấy IP hiện tại của máy (ước lượng)
    async getCurrentIP() {
        try {
            // Sử dụng WebRTC để lấy local IP
            return new Promise((resolve) => {
                const pc = new RTCPeerConnection({ iceServers: [] });
                pc.createDataChannel('');
                pc.createOffer().then(offer => pc.setLocalDescription(offer));

                pc.onicecandidate = (ice) => {
                    if (!ice || !ice.candidate || !ice.candidate.candidate) return;

                    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                    const match = ipRegex.exec(ice.candidate.candidate);

                    if (match) {
                        resolve(match[1]);
                        pc.close();
                    }
                };

                setTimeout(() => resolve(null), 3000);
            });
        } catch (error) {
            return null;
        }
    }

    // Khởi tạo
    async initialize() {
        this.setupUserName();

        // Đánh dấu đã cấu hình để không hiện thông báo
        localStorage.setItem('hasConfiguredServer', 'true');

        // Kiểm tra Supabase trước
        await this.checkSupabaseStatus();

        // Nếu Supabase không khả dụng, kiểm tra Local Server
        if (!this.isSupabaseAvailable) {
            await this.checkServerStatus();
        }

        // Load quiz trước
        await this.loadSharedQuizzes();

        // Khởi tạo bộ lọc danh mục
        this.initializeCategoryFilter();

        // Bật Realtime/Polling sau khi load xong
        this.setupRealtimeUpdates();

        this.setupEventListeners();

        // Yêu cầu quyền thông báo (optional)
        this.requestNotificationPermission();
    }

    // Thiết lập cập nhật realtime
    setupRealtimeUpdates() {
        if (this.isSupabaseAvailable && window.supabaseQuizManager) {
            // Bật Realtime cho Supabase
            window.supabaseQuizManager.enableRealtime();

            // Đăng ký callback để nhận cập nhật
            window.supabaseQuizManager.onQuizUpdate((update) => {
                this.handleRealtimeUpdate(update);
            });

            console.log('✅ Supabase Realtime enabled - Auto-update is active');
        } else if (this.isServerOnline) {
            // Bật Polling cho Local Server
            this.startServerPolling();
            console.log('✅ Local Server Polling enabled - Auto-update every 5 seconds');
        } else {
            console.warn('⚠️ No realtime updates available (offline mode)');
        }
    }

    // Bắt đầu polling cho Local Server
    startServerPolling() {
        // Dừng polling cũ nếu có
        this.stopServerPolling();

        // Lưu timestamp của quiz mới nhất
        if (this.sharedQuizzes.length > 0) {
            this.lastUpdateTime = new Date(this.sharedQuizzes[0].sharedAt).getTime();
        } else {
            this.lastUpdateTime = Date.now();
        }

        // Poll mỗi 5 giây
        this.pollingInterval = setInterval(() => {
            this.checkForUpdates();
        }, 5000);

        console.log('🔄 Started polling for updates every 5 seconds');
    }

    // Dừng polling
    stopServerPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log('⏹️ Stopped polling');
        }
    }

    // Kiểm tra cập nhật mới từ server
    async checkForUpdates() {
        if (!this.isServerOnline) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes`, {
                signal: AbortSignal.timeout(3000)
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            if (data.success && data.quizzes && data.quizzes.length > 0) {
                // Kiểm tra quiz mới
                const newQuizzes = data.quizzes.filter(quiz => {
                    const quizTime = new Date(quiz.sharedAt).getTime();
                    return quizTime > this.lastUpdateTime;
                });

                if (newQuizzes.length > 0) {
                    console.log(`🆕 Found ${newQuizzes.length} new quiz(zes)`);

                    // Cập nhật timestamp
                    this.lastUpdateTime = new Date(newQuizzes[0].sharedAt).getTime();

                    // Thêm quiz mới vào đầu danh sách
                    newQuizzes.reverse().forEach(quiz => {
                        this.handleRealtimeUpdate({
                            type: 'INSERT',
                            quiz: quiz
                        });
                    });

                    // Hiển thị thông báo
                    this.showNewQuizNotification(newQuizzes.length);
                }

                // Kiểm tra cập nhật views/attempts
                this.checkStatsUpdates(data.quizzes);
            }
        } catch (error) {
            // Không log lỗi để tránh spam console
            if (error.name !== 'AbortError' && error.name !== 'TimeoutError') {
                console.warn('Polling error:', error.message);
            }
        }
    }

    // Kiểm tra cập nhật stats (views, attempts)
    checkStatsUpdates(serverQuizzes) {
        serverQuizzes.forEach(serverQuiz => {
            const localQuiz = this.sharedQuizzes.find(q => q.id === serverQuiz.id);

            if (localQuiz) {
                // Kiểm tra xem có thay đổi không
                if (localQuiz.views !== serverQuiz.views ||
                    localQuiz.attempts !== serverQuiz.attempts) {

                    // Cập nhật stats
                    this.handleRealtimeUpdate({
                        type: 'UPDATE',
                        quiz: serverQuiz
                    });
                }
            }
        });
    }

    // Hiển thị thông báo quiz mới
    showNewQuizNotification(count) {
        const message = count === 1
            ? '🆕 Có 1 bài thi mới!'
            : `🆕 Có ${count} bài thi mới!`;

        // Hiển thị toast
        if (window.quizManager && window.quizManager.showToast) {
            window.quizManager.showToast(message, 'info');
        }

        // Hiển thị badge trên tab nếu không đang xem
        if (document.hidden) {
            this.showBrowserNotification(message);
        }
    }

    // Hiển thị thông báo trình duyệt
    showBrowserNotification(message) {
        // Kiểm tra quyền thông báo
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Trắc Nghiệm Pro', {
                body: message,
                icon: 'logo/logo.png',
                badge: 'logo/logo.png'
            });
        }
    }

    // Yêu cầu quyền thông báo
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
            }
        }
    }

    // Xử lý cập nhật realtime
    handleRealtimeUpdate(update) {
        const { type, quiz } = update;

        if (type === 'INSERT') {
            // Quiz mới được thêm
            this.handleNewQuizRealtime(quiz);
        } else if (type === 'UPDATE') {
            // Quiz được cập nhật (views, attempts, likes)
            this.handleQuizUpdateRealtime(quiz);
        } else if (type === 'DELETE') {
            // Quiz bị xóa
            this.handleQuizDeleteRealtime(quiz);
        }
    }

    // Xử lý quiz mới (realtime)
    handleNewQuizRealtime(quiz) {
        // Thêm vào đầu danh sách
        this.sharedQuizzes.unshift(quiz);

        // Render lại danh sách
        this.renderSharedQuizzes(this.sharedQuizzes);

        // Hiệu ứng highlight cho quiz mới
        setTimeout(() => {
            const quizCard = document.querySelector(`[data-quiz-id="${quiz.id}"]`);
            if (quizCard) {
                quizCard.classList.add('quiz-new-highlight');
                setTimeout(() => {
                    quizCard.classList.remove('quiz-new-highlight');
                }, 3000);
            }
        }, 100);
    }

    // Xử lý cập nhật quiz (realtime)
    handleQuizUpdateRealtime(quiz) {
        // Tìm quiz trong danh sách
        const index = this.sharedQuizzes.findIndex(q => q.id === quiz.id);

        if (index !== -1) {
            // Cập nhật dữ liệu
            this.sharedQuizzes[index] = {
                ...this.sharedQuizzes[index],
                views: quiz.views,
                attempts: quiz.attempts,
                likes: quiz.likes
            };

            // Cập nhật UI cho quiz card này
            this.updateQuizCardStats(quiz.id, quiz);
        }
    }

    // Xử lý xóa quiz (realtime)
    handleQuizDeleteRealtime(quiz) {
        // Xóa khỏi danh sách
        this.sharedQuizzes = this.sharedQuizzes.filter(q => q.id !== quiz.id);

        // Render lại
        this.renderSharedQuizzes(this.sharedQuizzes);
    }

    // Cập nhật stats của quiz card
    updateQuizCardStats(quizId, quiz) {
        const quizCard = document.querySelector(`[data-quiz-id="${quizId}"]`);

        if (!quizCard) return;

        // Cập nhật views
        const viewsElement = quizCard.querySelector('.stat-item:nth-child(2) span');
        if (viewsElement) {
            const oldViews = parseInt(viewsElement.textContent);
            const newViews = quiz.views || 0;

            if (newViews > oldViews) {
                viewsElement.textContent = `${newViews} lượt xem`;
                this.animateStatChange(viewsElement);
            }
        }

        // Cập nhật attempts
        const attemptsElement = quizCard.querySelector('.stat-item:nth-child(3) span');
        if (attemptsElement) {
            const oldAttempts = parseInt(attemptsElement.textContent);
            const newAttempts = quiz.attempts || 0;

            if (newAttempts > oldAttempts) {
                attemptsElement.textContent = `${newAttempts} lượt làm`;
                this.animateStatChange(attemptsElement);
            }
        }
    }

    // Hiệu ứng khi stat thay đổi
    animateStatChange(element) {
        element.classList.add('stat-updated');
        setTimeout(() => {
            element.classList.remove('stat-updated');
        }, 1000);
    }

    // Kiểm tra Supabase có sẵn sàng không
    async checkSupabaseStatus() {
        try {
            // Đ���i Supabase module load
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                this.isSupabaseAvailable = true;
                console.log('✅ Supabase is available');
                return true;
            }
        } catch (error) {
            console.warn('Supabase not available:', error);
        }

        this.isSupabaseAvailable = false;
        return false;
    }

    // Kiểm tra trạng thái server
    async checkServerStatus() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 giây timeout

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                this.isServerOnline = true;
                this.offlineMode = false;
                this.updateServerStatus(true);
                return true;
            }
        } catch (error) {
            console.warn('Server offline:', error.message);
            this.isServerOnline = false;
            this.offlineMode = true;
            this.updateServerStatus(false);
        }
        return false;
    }

    // Cập nhật hiển thị trạng thái server
    updateServerStatus(isOnline) {
        const statusIndicator = document.getElementById('server-status-indicator');
        if (statusIndicator) {
            if (isOnline) {
                statusIndicator.innerHTML = `
                    <i class="fas fa-circle" style="color: #48bb78;"></i>
                    <span>Server đang hoạt động</span>
                `;
                statusIndicator.className = 'server-status online';
            } else {
                statusIndicator.innerHTML = `
                    <i class="fas fa-circle" style="color: #f56565;"></i>
                    <span>Chế độ Offline</span>
                    <button class="btn-retry-server" onclick="exploreQuizManager.retryServerConnection()">
                        <i class="fas fa-sync"></i> Thử lại
                    </button>
                `;
                statusIndicator.className = 'server-status offline';
            }
        }
    }

    // Thử kết nối lại server
    async retryServerConnection() {
        quizManager.showToast('🔄 Đang kiểm tra kết nối server...', 'info');
        const isOnline = await this.checkServerStatus();

        if (isOnline) {
            quizManager.showToast('✅ Đã kết nối server thành công!', 'success');
            this.loadSharedQuizzes();
        } else {
            quizManager.showToast('❌ Không thể kết nối server. Vui lòng khởi động server.', 'error');
            this.showServerInstructions();
        }
    }

    // Hiển thị hướng dẫn thiết lập lần đầu
    showFirstTimeSetupGuide() {
        const modal = document.createElement('div');
        modal.className = 'server-instructions-modal first-time-setup';
        modal.innerHTML = `
            <div class="server-instructions-content">
                <div class="server-instructions-header">
                    <h3><i class="fas fa-rocket"></i> Chào Mừng Đến Với Tính Năng Chia Sẻ!</h3>
                    <button class="btn-close" onclick="exploreQuizManager.closeFirstTimeSetup()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="server-instructions-body">
                    <p><strong>Để chia sẻ và xem bài làm từ cộng đồng trong mạng LAN:</strong></p>
                    
                    <div class="setup-option recommended">
                        <div class="option-badge">✨ Dễ Dàng</div>
                        <h4><i class="fas fa-network-wired"></i> Local Server (Trong Mạng LAN)</h4>
                        <p>Chia sẻ trong mạng nội bộ, tốc độ cao</p>
                        <ul>
                            <li>✅ Tốc độ nhanh</li>
                            <li>✅ Không cần Internet</li>
                            <li>✅ Miễn phí hoàn toàn</li>
                            <li>✅ Dữ liệu lưu trên máy bạn</li>
                        </ul>
                        <button class="btn btn-primary" onclick="exploreQuizManager.showLocalServerSetupGuide()">
                            <i class="fas fa-book"></i> Hướng Dẫn Cài Đặt
                        </button>
                    </div>

                    <div class="instruction-note">
                        <i class="fas fa-info-circle"></i>
                        <p><strong>Lưu ý:</strong> Cả máy chủ và máy khách phải cùng mạng WiFi/LAN để chia sẻ được.</p>
                    </div>
                </div>
                <div class="server-instructions-footer">
                    <button class="btn btn-success" onclick="exploreQuizManager.closeFirstTimeSetup()">
                        <i class="fas fa-check"></i> Đã Hiểu, Bắt Đầu Sử Dụng
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Đóng hướng dẫn lần đ��u
    closeFirstTimeSetup() {
        localStorage.setItem('hasConfiguredServer', 'true');
        document.querySelector('.first-time-setup')?.remove();
    }

    // Hiển thị hướng dẫn Local Server
    showLocalServerSetupGuide() {
        const modal = document.createElement('div');
        modal.className = 'server-instructions-modal local-server-guide';
        modal.innerHTML = `
            <div class="server-instructions-content">
                <div class="server-instructions-header">
                    <h3><i class="fas fa-server"></i> Hướng Dẫn Cài Đặt Local Server</h3>
                    <button class="btn-close" onclick="this.closest('.local-server-guide').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="server-instructions-body">
                    <div class="server-role-selection">
                        <h4>Bạn đang ở máy nào?</h4>
                        <div class="role-buttons">
                            <button class="btn btn-primary" onclick="exploreQuizManager.showServerHostGuide()">
                                <i class="fas fa-server"></i> Máy Chủ (Host)
                                <small>Máy chạy server, chia sẻ bài</small>
                            </button>
                            <button class="btn btn-secondary" onclick="exploreQuizManager.showServerClientGuide()">
                                <i class="fas fa-laptop"></i> Máy Khách (Client)
                                <small>Máy xem bài từ máy khác</small>
                            </button>
                        </div>
                    </div>

                    <div class="instruction-note">
                        <i class="fas fa-info-circle"></i>
                        <p><strong>Lưu ý:</strong> Cả 2 máy phải cùng mạng WiFi/LAN</p>
                    </div>
                </div>
                <div class="server-instructions-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.local-server-guide').remove()">
                        <i class="fas fa-times"></i> Đóng
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Hướng dẫn cho máy chủ (Host)
    showServerHostGuide() {
        document.querySelector('.local-server-guide')?.remove();

        const modal = document.createElement('div');
        modal.className = 'server-instructions-modal server-host-guide';
        modal.innerHTML = `
            <div class="server-instructions-content">
                <div class="server-instructions-header">
                    <h3><i class="fas fa-server"></i> Hướng Dẫn Cho Máy Chủ</h3>
                    <button class="btn-close" onclick="this.closest('.server-host-guide').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="server-instructions-body">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Khởi Động Server</h4>
                            <p><strong>Cách 1:</strong> Double-click file <code>start-server.bat</code></p>
                            <p><strong>Cách 2:</strong> Mở Terminal và chạy:</p>
                            <code>npm run server</code>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Lấy Địa Chỉ IP</h4>
                            <p>Server sẽ hiển thị IP trong console:</p>
                            <code>Network: http://192.168.1.100:3000</code>
                            <p>Hoặc chạy lệnh:</p>
                            <code>ipconfig</code> (Windows) hoặc <code>ifconfig</code> (Mac/Linux)
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Cấu Hình Firewall</h4>
                            <p><strong>Windows:</strong> Chạy lệnh (Run as Administrator):</p>
                            <code>netsh advfirewall firewall add rule name="TracNghiemPro" dir=in action=allow protocol=TCP localport=3000</code>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Chia Sẻ IP Cho Máy Khác</h4>
                            <p>Gửi địa chỉ IP cho người dùng khác:</p>
                            <code>http://192.168.1.100:3000</code>
                        </div>
                    </div>

                    <div class="instruction-note">
                        <i class="fas fa-book"></i>
                        <p>Xem hướng dẫn chi tiết trong file: <code>HUONG_DAN_CHIA_SE_TU_MAY_KHAC.md</code></p>
                    </div>
                </div>
                <div class="server-instructions-footer">
                    <button class="btn btn-primary" onclick="exploreQuizManager.retryServerConnection(); this.closest('.server-host-guide').remove();">
                        <i class="fas fa-sync"></i> Kiểm Tra Kết Nối
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.server-host-guide').remove()">
                        <i class="fas fa-times"></i> Đóng
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Hướng dẫn cho máy khách (Client)
    showServerClientGuide() {
        document.querySelector('.local-server-guide')?.remove();

        const modal = document.createElement('div');
        modal.className = 'server-instructions-modal server-client-guide';
        modal.innerHTML = `
            <div class="server-instructions-content">
                <div class="server-instructions-header">
                    <h3><i class="fas fa-laptop"></i> Hướng Dẫn Cho Máy Khách</h3>
                    <button class="btn-close" onclick="this.closest('.server-client-guide').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="server-instructions-body">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Lấy Địa Chỉ IP Từ Máy Chủ</h4>
                            <p>Hỏi người quản lý máy chủ để lấy địa chỉ IP</p>
                            <p>Ví dụ: <code>http://192.168.1.100:3000</code></p>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Cấu Hình Server URL</h4>
                            <p>Click nút bên dưới để mở cấu hình</p>
                        </div>
                    </div>

                    <div class="instruction-note">
                        <i class="fas fa-info-circle"></i>
                        <p><strong>Lưu ý:</strong> Đảm bảo máy của bạn cùng mạng WiFi/LAN với máy chủ</p>
                    </div>
                </div>
                <div class="server-instructions-footer">
                    <button class="btn btn-primary" onclick="exploreQuizManager.showServerURLDialog(); this.closest('.server-client-guide').remove();">
                        <i class="fas fa-cog"></i> Mở Cấu Hình Server
                    </button>
                    <button class="btn btn-secondary" onclick="exploreQuizManager.autoDetectServer(); this.closest('.server-client-guide').remove();">
                        <i class="fas fa-search"></i> Tự Động Tìm Server
                    </button>
                    <button class="btn btn-danger" onclick="this.closest('.server-client-guide').remove()">
                        <i class="fas fa-times"></i> Đóng
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Hiển thị hướng dẫn khởi động server (giữ lại cho tương thích)
    showServerInstructions() {
        this.showLocalServerSetupGuide();
    }

    // Thiết lập tên người dùng
    setupUserName() {
        const userNameInput = document.getElementById('user-name-input');
        if (userNameInput) {
            userNameInput.value = this.currentUserName;
            userNameInput.addEventListener('change', (e) => {
                this.currentUserName = e.target.value.trim();
                localStorage.setItem('userName', this.currentUserName);
            });
        }
    }

    // Thiết lập event listeners
    setupEventListeners() {
        // Nút tìm kiếm
        const searchBtn = document.getElementById('search-shared-quiz-btn');
        const searchInput = document.getElementById('search-shared-quiz');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchSharedQuizzes(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchSharedQuizzes(searchInput.value);
                }
            });
        }

        // Nút làm mới với hiệu ứng
        const refreshBtn = document.getElementById('refresh-shared-quizzes');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                // Thêm class refreshing để hiệu ứng xoay
                refreshBtn.classList.add('refreshing');

                // Load quiz
                await this.loadSharedQuizzes();

                // Xóa class sau khi load xong
                setTimeout(() => {
                    refreshBtn.classList.remove('refreshing');
                }, 500);
            });
        }
    }

    // Tải danh sách quiz được chia sẻ
    async loadSharedQuizzes() {
        try {
            this.showLoading(true);

            // KIỂM TRA LẠI Supabase mỗi lần load (fix timing issue)
            const supabaseReady = window.supabaseQuizManager && window.supabaseQuizManager.isAvailable();

            if (supabaseReady) {
                this.isSupabaseAvailable = true;
                console.log('✅ Supabase detected, loading from cloud...');
            }

            // Ưu tiên Supabase nếu có
            if (supabaseReady) {
                try {
                    const result = await window.supabaseQuizManager.getAllQuizzes(50);
                    if (result.success) {
                        this.sharedQuizzes = result.quizzes;
                        this.renderSharedQuizzes(this.sharedQuizzes);
                        quizManager.showToast(`☁️ Đã tải ${result.quizzes.length} quiz từ Supabase`, 'success');
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase load failed, trying local server:', error);
                }
            }

            // Fallback sang Local server
            if (!this.isServerOnline) {
                await this.checkServerStatus();
            }

            if (!this.isServerOnline) {
                this.loadOfflineQuizzes();
                return;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (data.success) {
                this.sharedQuizzes = data.quizzes;
                this.renderSharedQuizzes(this.sharedQuizzes);
                this.isServerOnline = true;
                this.updateServerStatus(true);
            } else {
                this.showError('Không thể tải danh sách đề thi');
            }
        } catch (error) {
            console.error('Error loading shared quizzes:', error);
            this.isServerOnline = false;
            this.updateServerStatus(false);
            this.loadOfflineQuizzes();
        } finally {
            this.showLoading(false);
        }
    }

    // Load quiz từ localStorage (chế độ offline)
    loadOfflineQuizzes() {
        const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];
        this.sharedQuizzes = offlineQuizzes;

        if (offlineQuizzes.length > 0) {
            this.renderSharedQuizzes(offlineQuizzes);
            quizManager.showToast('📱 Đang xem quiz đã lưu offline', 'info');
        } else {
            this.showOfflineEmptyState();
        }
    }

    // Hiển thị trạng thái rỗng khi offline
    showOfflineEmptyState() {
        const container = document.getElementById('shared-quizzes-grid');
        if (container) {
            container.innerHTML = `
                <div class="offline-empty-state">
                    <i class="fas fa-wifi-slash"></i>
                    <h3>Chế độ Offline</h3>
                    <p>Không có quiz nào được lưu offline.</p>
                    <p>Vui lòng khởi động server để xem quiz từ cộng đồng.</p>
                    <button class="btn btn-primary" onclick="exploreQuizManager.showServerInstructions()">
                        <i class="fas fa-question-circle"></i>
                        Hướng Dẫn Khởi Động Server
                    </button>
                    <button class="btn btn-secondary" onclick="exploreQuizManager.retryServerConnection()">
                        <i class="fas fa-sync"></i>
                        Thử Kết Nối Lại
                    </button>
                </div>
            `;
        }
    }

    // Tìm kiếm quiz
    async searchSharedQuizzes(keyword) {
        if (!keyword || keyword.trim() === '') {
            this.loadSharedQuizzes();
            return;
        }

        try {
            this.showLoading(true);

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/search/${encodeURIComponent(keyword)}`);
            const data = await response.json();

            if (data.success) {
                this.renderSharedQuizzes(data.quizzes);
                if (data.quizzes.length === 0) {
                    quizManager.showToast(`Không tìm thấy kết quả cho "${keyword}"`, 'info');
                }
            }
        } catch (error) {
            console.error('Error searching quizzes:', error);
            this.showError('Lỗi khi tìm kiếm');
        } finally {
            this.showLoading(false);
        }
    }

    // Hiển thị danh sách quiz với layout ngang
    renderSharedQuizzes(quizzes) {
        console.log('🎨 Rendering quizzes with horizontal layout:', quizzes.length);

        // Phân loại quiz
        const trendingQuizzes = this.getTrendingQuizzes(quizzes);
        const latestQuizzes = this.getLatestQuizzes(quizzes);

        // Render trending quizzes với carousel nếu có đủ quiz
        if (trendingQuizzes.length >= 3) {
            this.renderTrendingWithCarousel('trending-quizzes', trendingQuizzes.slice(0, 12));
        } else {
            this.renderQuizSection('trending-quizzes', trendingQuizzes.slice(0, 10));
        }

        // Render latest quizzes
        this.renderQuizSection('latest-quizzes', latestQuizzes.slice(0, 10));

        // Cập nhật số lượng danh mục
        this.updateCategoryCounts();
    }

    // Render một section quiz
    renderQuizSection(containerId, quizzes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (quizzes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Chưa có đề thi</h3>
                    <p>Hãy là người đầu tiên chia sẻ đề thi!</p>
                </div>
            `;
            return;
        }

        const quizzesHTML = quizzes.map(quiz => {
            const timeAgo = this.getTimeAgo(quiz.sharedAt);
            const date = new Date(quiz.sharedAt).toLocaleDateString('vi-VN');
            const categoryName = this.getCategoryName(quiz.category || 'khac');
            const categoryIcon = this.getCategoryIcon(quiz.category || 'khac');

            return `
                <div class="quiz-card-horizontal" data-quiz-id="${quiz.id}" data-category="${quiz.category || 'khac'}">
                    <div class="quiz-card-header">
                        <div class="quiz-card-category">
                            <i class="${categoryIcon}"></i>
                            ${categoryName}
                        </div>
                        <div class="quiz-card-stats">
                            <div class="quiz-card-stat">
                                <i class="fas fa-eye"></i>
                                <span>${quiz.views || 0}</span>
                            </div>
                            <div class="quiz-card-stat">
                                <i class="fas fa-fire"></i>
                                <span>${quiz.attempts || 0}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quiz-card-content">
                        <div class="quiz-card-title">${this.escapeHtml(quiz.title)}</div>
                        
                        <div class="quiz-card-meta">
                            <div class="quiz-card-meta-row">
                                <div class="quiz-card-meta-item">
                                    <i class="fas fa-user"></i>
                                    <span>${this.escapeHtml(quiz.userName)}</span>
                                </div>
                                <div class="quiz-card-meta-item">
                                    <i class="fas fa-question-circle"></i>
                                    <span>${quiz.totalQuestions} câu</span>
                                </div>
                            </div>
                            <div class="quiz-card-meta-row">
                                <div class="quiz-card-meta-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${timeAgo}</span>
                                </div>
                                <div class="quiz-card-meta-item">
                                    <i class="fas fa-calendar"></i>
                                    <span>${date}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quiz-card-actions">
                            <button class="btn-quiz-action btn-quiz-secondary" onclick="exploreQuizManager.viewQuizDetails('${quiz.id}')">
                                <i class="fas fa-info-circle"></i>
                                <span>Chi tiết</span>
                            </button>
                        </div>
                        <div class="quiz-card-practice-action">
                            <button class="btn-quiz-practice-full" onclick="exploreQuizManager.startPracticeMode('${quiz.id}')">
                                <i class="fas fa-play"></i>
                                <span>Vào ôn thi</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = quizzesHTML;

        // 🎯 APPLY DYNAMIC CONTENT-AWARE LAYOUT after rendering
        setTimeout(() => {
            if (window.optimizeContentAwareLayout) {
                window.optimizeContentAwareLayout();
            }
        }, 100);
    }

    // 🔥 Render trending quizzes với hiệu ứng carousel
    renderTrendingWithCarousel(containerId, quizzes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Mảng hình ảnh cho trending carousel
        const trendingImages = [
            'https://images.unsplash.com/photo-1758314896569-b3639ee707c4?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1671649240322-2124cd07eaae?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1673029925648-af80569efc46?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1666533099824-abd0ed813f2a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1671105035554-7f8c2a587201?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1686750875748-d00684d36b1e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1686844462591-393ceae12be0?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1686839181367-febb561faa53?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1671199850329-91cae34a6b6d?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1685655611311-9f801b43b9fa?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1675598468920-878ae1e46f14?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1718036094878-ecdce2b1be95?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ];

        // Clear container
        container.innerHTML = '';

        // Sử dụng cấu trúc HTML từ file txt với quiz data - Compact version
        const carouselHTML = `
            <div class="loop-images trending-loop-images" style="min-height: 280px; padding: 20px 0 25px 0; margin-bottom: 25px;">
                <div class="carousel-track trending-carousel-track" style="--time: 40s; --total: ${quizzes.length}; --left: -300rem;">
                    ${quizzes.map((quiz, index) => {
            const timeAgo = this.getTimeAgo(quiz.sharedAt);
            const categoryName = this.getCategoryName(quiz.category || 'khac');
            const categoryIcon = this.getCategoryIcon(quiz.category || 'khac');
            const backgroundImage = trendingImages[index % trendingImages.length];

            return `
                            <div class="carousel-item trending-carousel-item" 
                                 data-quiz-id="${quiz.id}"
                                 style="--i: ${index + 1};"
                                 onclick="exploreQuizManager.startPracticeMode('${quiz.id}')">
                                <div class="trending-quiz-card" 
                                     style="width: 100%; height: 100%; background-image: url('${backgroundImage}'); background-size: cover; background-position: center; transform: rotateY(-45deg); transition: 0.5s ease-in-out; border-radius: 16px; overflow: hidden; border: 2px solid #667eea; box-shadow: 0 6px 24px rgba(102, 126, 234, 0.25); backdrop-filter: blur(8px); display: flex; flex-direction: column; position: relative; mask: linear-gradient(black 75%, transparent 100%); -webkit-mask: linear-gradient(black 75%, transparent 100%);">
                                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(102, 126, 234, 0.88) 0%, rgba(118, 75, 162, 0.92) 100%); z-index: 1;"></div>
                                    <div class="trending-card-header" style="position: relative; padding: 12px; background: transparent; flex: 1; display: flex; flex-direction: column; z-index: 2; min-height: 0;">
                                        <div class="trending-category" style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: rgba(255, 255, 255, 0.95); border-radius: 12px; font-size: 9px; font-weight: 600; color: #667eea; margin-bottom: 6px; width: fit-content; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
                                            <i class="${categoryIcon}"></i> ${categoryName}
                                        </div>
                                        <div class="trending-title" style="font-size: 13px; font-weight: 700; margin-bottom: 5px; color: white; line-height: 1.2; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${this.escapeHtml(quiz.title)}</div>
                                        
                                        ${quiz.description ? `
                                        <div class="trending-description" style="font-size: 10px; color: rgba(255, 255, 255, 0.85); margin-bottom: 6px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">
                                            ${this.escapeHtml(quiz.description)}
                                        </div>
                                        ` : ''}
                                        
                                        <div class="trending-stats" style="display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap;">
                                            <div style="display: flex; align-items: center; gap: 2px; padding: 2px 5px; background: rgba(255, 255, 255, 0.25); border-radius: 8px; font-size: 8px; color: white; font-weight: 600;">
                                                <i class="fas fa-fire" style="color: #ff6b6b;"></i> ${quiz.attempts || 0}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 2px; padding: 2px 5px; background: rgba(255, 255, 255, 0.25); border-radius: 8px; font-size: 8px; color: white; font-weight: 600;">
                                                <i class="fas fa-eye" style="color: #4ecdc4;"></i> ${quiz.views || 0}
                                            </div>
                                            ${quiz.difficulty ? `
                                            <div style="display: flex; align-items: center; gap: 2px; padding: 2px 5px; background: rgba(255, 255, 255, 0.25); border-radius: 8px; font-size: 8px; color: white; font-weight: 600;">
                                                <i class="fas fa-chart-line" style="color: #ffa726;"></i> ${this.getDifficultyText(quiz.difficulty)}
                                            </div>
                                            ` : ''}
                                        </div>
                                        
                                        <div class="trending-meta" style="display: flex; gap: 4px; font-size: 7px; color: rgba(255, 255, 255, 0.9); flex-wrap: wrap; margin-bottom: 6px;">
                                            <span style="display: flex; align-items: center; gap: 2px; padding: 1px 4px; background: rgba(255, 255, 255, 0.15); border-radius: 5px;"><i class="fas fa-user" style="color: #64b5f6;"></i> ${this.escapeHtml(quiz.userName)}</span>
                                            <span style="display: flex; align-items: center; gap: 2px; padding: 1px 4px; background: rgba(255, 255, 255, 0.15); border-radius: 5px;"><i class="fas fa-question-circle" style="color: #81c784;"></i> ${quiz.totalQuestions} câu</span>
                                            ${quiz.timeLimit ? `
                                            <span style="display: flex; align-items: center; gap: 2px; padding: 1px 4px; background: rgba(255, 255, 255, 0.15); border-radius: 5px;"><i class="fas fa-stopwatch" style="color: #ffb74d;"></i> ${quiz.timeLimit}p</span>
                                            ` : ''}
                                            <span style="display: flex; align-items: center; gap: 2px; padding: 1px 4px; background: rgba(255, 255, 255, 0.15); border-radius: 5px;"><i class="fas fa-clock" style="color: #f06292;"></i> ${timeAgo}</span>
                                        </div>
                                        
                                        ${quiz.tags && quiz.tags.length > 0 ? `
                                        <div class="trending-tags" style="display: flex; gap: 2px; margin-top: auto; flex-wrap: wrap;">
                                            ${quiz.tags.slice(0, 2).map(tag => `
                                                <span style="font-size: 6px; padding: 1px 3px; background: rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.9); border-radius: 6px; font-weight: 500;">#${this.escapeHtml(tag)}</span>
                                            `).join('')}
                                            ${quiz.tags.length > 2 ? `<span style="font-size: 6px; padding: 1px 3px; background: rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.9); border-radius: 6px; font-weight: 500;">+${quiz.tags.length - 2}</span>` : ''}
                                        </div>
                                        ` : ''}
                                    </div>
                                    <div class="trending-actions" style="padding: 8px 12px; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(8px); z-index: 3; position: relative; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                                        <button class="trending-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 10px; background: rgba(255, 255, 255, 0.95); color: #667eea; border: none; border-radius: 8px; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                                            <i class="fas fa-play"></i> Vào ôn thi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                <span class="scroll-down trending-scroll-text" style="position: absolute; bottom: 1rem; left: 0; right: 0; font-family: 'Poppins', sans-serif; text-align: center; font-size: 13px; color: #667eea; display: flex; flex-direction: column; align-items: center; text-decoration: none; opacity: 0.8; font-weight: 600;">
                    📈 Đề thi xu hướng <span class="arrow" style="font-size: 16px; margin-top: 4px;">↓</span>
                </span>
            </div>
        `;

        container.innerHTML = carouselHTML;

        // Áp dụng CSS từ file txt với màu chủ đạo của website
        if (!document.getElementById('trending-carousel-styles')) {
            const trendingStyles = document.createElement('style');
            trendingStyles.id = 'trending-carousel-styles';
            trendingStyles.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                
                /* Trending carousel styles based on txt files */
                .trending-loop-images {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                }
                
                .trending-carousel-track {
                    min-width: calc(10rem * var(--total));
                    height: 24rem;
                    position: relative;
                }
                
                .trending-carousel-item {
                    position: absolute;
                    width: 24rem;
                    height: 24rem;
                    left: 100%;
                    display: flex;
                    justify-content: center;
                    perspective: 1000px;
                    transform-style: preserve-3d;
                    animation: scroll-left var(--time) linear infinite;
                    animation-delay: calc(var(--time) / var(--total) * (var(--i) - 1) - var(--time));
                    will-change: left;
                    transition: 0.5s ease-in-out;
                    cursor: pointer;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .trending-carousel-item:hover .trending-quiz-card {
                    transform: rotateY(0deg) translateY(-1rem) !important;
                    border-color: #764ba2 !important;
                    box-shadow: 0 12px 40px rgba(118, 75, 162, 0.4) !important;
                }
                
                .trending-carousel-item:hover .trending-btn {
                    transform: translateY(-2px) !important;
                    background: white !important;
                    color: #764ba2 !important;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
                }
                
                @keyframes scroll-left {
                    to {
                        left: var(--left);
                    }
                }
                
                .trending-scroll-text .arrow {
                    animation: bounce 2s infinite;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }
                
                .trending-category {
                    animation: pulse 3s infinite !important;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                
                /* Responsive cho mobile */
                @media (max-width: 768px) {
                    .trending-loop-images {
                        min-height: 240px !important;
                        padding: 15px 0 20px 0 !important;
                    }
                    
                    .trending-carousel-track {
                        height: 20rem !important;
                    }
                    
                    .trending-carousel-item {
                        width: 20rem !important;
                        height: 20rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .trending-loop-images {
                        min-height: 220px !important;
                        padding: 12px 0 18px 0 !important;
                    }
                    
                    .trending-carousel-track {
                        height: 18rem !important;
                    }
                    
                    .trending-carousel-item {
                        width: 18rem !important;
                        height: 18rem !important;
                    }
                }
                
                /* Desktop - hiển thị 3 cards cùng lúc */
                @media (min-width: 1200px) {
                    .trending-loop-images {
                        min-height: 300px !important;
                    }
                    
                    .trending-carousel-track {
                        height: 26rem !important;
                    }
                    
                    .trending-carousel-item {
                        width: 26rem !important;
                        height: 26rem !important;
                    }
                }
                
                /* Smooth performance optimizations */
                @media (prefers-reduced-motion: reduce) {
                    .trending-carousel-item {
                        animation: none;
                    }
                    
                    .trending-scroll-text .arrow {
                        animation: none;
                    }
                }
            `;
            document.head.appendChild(trendingStyles);
        }

        console.log('📈 Trending carousel rendered with', quizzes.length, 'quizzes using smooth txt-based animations');
    }

    // Lấy quiz xu hướng (sắp xếp theo views + attempts)
    getTrendingQuizzes(quizzes) {
        return [...quizzes].sort((a, b) => {
            const scoreA = (a.views || 0) + (a.attempts || 0) * 2;
            const scoreB = (b.views || 0) + (b.attempts || 0) * 2;
            return scoreB - scoreA;
        });
    }

    // Lấy quiz mới nhất (sắp xếp theo thời gian)
    getLatestQuizzes(quizzes) {
        return [...quizzes].sort((a, b) => {
            return new Date(b.sharedAt) - new Date(a.sharedAt);
        });
    }

    // Hiển thị tất cả quiz của một loại
    showAllQuizzes(type) {
        console.log('📋 Showing all quizzes of type:', type);

        let quizzes;
        if (type === 'trending') {
            quizzes = this.getTrendingQuizzes(this.sharedQuizzes);
        } else if (type === 'latest') {
            quizzes = this.getLatestQuizzes(this.sharedQuizzes);
        } else {
            quizzes = this.sharedQuizzes;
        }

        this.showQuizModal(type, quizzes);
    }

    // Hiển thị modal với tất cả quiz
    showQuizModal(type, quizzes) {
        const typeName = type === 'trending' ? 'Xu hướng' : 'Mới nhất';
        const typeIcon = type === 'trending' ? 'fas fa-fire' : 'fas fa-clock';

        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-modal-overlay" onclick="this.closest('.quiz-modal').remove()"></div>
            <div class="quiz-modal-content">
                <div class="quiz-modal-header">
                    <h3><i class="${typeIcon}"></i> Đề thi ${typeName}</h3>
                    <button class="quiz-modal-close" onclick="this.closest('.quiz-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="quiz-modal-body">
                    <div class="quiz-grid">
                        ${quizzes.map(quiz => {
            const categoryName = this.getCategoryName(quiz.category || 'khac');
            const categoryIcon = this.getCategoryIcon(quiz.category || 'khac');
            const timeAgo = this.getTimeAgo(quiz.sharedAt);

            return `
                                <div class="quiz-modal-card" data-quiz-id="${quiz.id}">
                                    <div class="quiz-modal-card-header">
                                        <div class="quiz-card-category">
                                            <i class="${categoryIcon}"></i>
                                            ${categoryName}
                                        </div>
                                    </div>
                                    <div class="quiz-modal-card-title">${this.escapeHtml(quiz.title)}</div>
                                    <div class="quiz-modal-card-meta">
                                        <span><i class="fas fa-user"></i> ${this.escapeHtml(quiz.userName)}</span>
                                        <span><i class="fas fa-question-circle"></i> ${quiz.totalQuestions} câu</span>
                                        <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                                    </div>
                                    <div class="quiz-modal-card-actions">
                                        <button class="btn-quiz-action btn-quiz-primary" onclick="exploreQuizManager.startSharedQuiz('${quiz.id}'); this.closest('.quiz-modal').remove();">
                                            <i class="fas fa-play"></i> Vào thi
                                        </button>
                                    </div>
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        if (!document.getElementById('quiz-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'quiz-modal-styles';
            styles.textContent = `
                .quiz-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quiz-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                .quiz-modal-content {
                    position: relative;
                    background: white;
                    border-radius: 16px;
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }
                .quiz-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e1e5e9;
                }
                .quiz-modal-header h3 {
                    margin: 0;
                    font-size: 20px;
                    color: #2d3748;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .quiz-modal-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #64748b;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }
                .quiz-modal-close:hover {
                    background: #f1f5f9;
                    color: #2d3748;
                }
                .quiz-modal-body {
                    padding: 24px;
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .quiz-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .quiz-modal-card {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px solid #e1e5e9;
                    transition: all 0.3s ease;
                }
                .quiz-modal-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .quiz-modal-card-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 12px 0 8px 0;
                    line-height: 1.4;
                }
                .quiz-modal-card-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 12px;
                }
                .quiz-modal-card-actions {
                    display: flex;
                    gap: 8px;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Chia sẻ quiz - Mở modal
    shareQuiz(quizId) {
        const quiz = quizManager.quizzes.find(q => q.id === quizId);

        if (!quiz) {
            quizManager.showToast('Không tìm thấy quiz!', 'error');
            return;
        }

        // Lưu quiz ID để sử dụng sau
        this.currentSharingQuizId = quizId;

        // Điền thông tin vào modal
        const userNameInput = document.getElementById('share-user-name');
        const titleInput = document.getElementById('share-quiz-title');
        const descriptionInput = document.getElementById('share-quiz-description');
        const countSpan = document.getElementById('share-quiz-count');
        const dateSpan = document.getElementById('share-quiz-date');
        const timeSpan = document.getElementById('share-quiz-time');

        // Điền tên người dùng từ localStorage hoặc từ tab khám phá
        if (userNameInput) {
            userNameInput.value = this.currentUserName || '';
        }

        // Điền tên quiz gốc (người dùng có thể sửa)
        if (titleInput) {
            titleInput.value = quiz.title;
        }

        // Điền mô tả gốc (người dùng có thể sửa)
        if (descriptionInput) {
            descriptionInput.value = quiz.description || '';
        }

        // Hiển thị số câu hỏi
        if (countSpan) {
            countSpan.textContent = quiz.totalQuestions;
        }

        // Hiển thị ngày hiện tại
        const now = new Date();
        if (dateSpan) {
            dateSpan.textContent = now.toLocaleDateString('vi-VN');
        }

        // Hiển thị thời gian hiện tại
        if (timeSpan) {
            timeSpan.textContent = now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Mở modal
        const modal = document.getElementById('share-quiz-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Đóng modal chia sẻ
    closeShareModal() {
        const modal = document.getElementById('share-quiz-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentSharingQuizId = null;
    }

    // Xác nhận chia sẻ quiz
    async confirmShareQuiz() {
        if (!this.currentSharingQuizId) {
            quizManager.showToast('Lỗi: Không tìm thấy quiz!', 'error');
            return;
        }

        const quiz = quizManager.quizzes.find(q => q.id === this.currentSharingQuizId);
        if (!quiz) {
            quizManager.showToast('Không tìm thấy quiz!', 'error');
            return;
        }

        // Lấy thông tin từ form
        const userName = document.getElementById('share-user-name').value.trim();
        const title = document.getElementById('share-quiz-title').value.trim();
        const description = document.getElementById('share-quiz-description').value.trim();
        const category = document.getElementById('share-quiz-category').value;

        // Validate
        if (!userName) {
            quizManager.showToast('Vui lòng nhập tên của bạn!', 'warning');
            document.getElementById('share-user-name').focus();
            return;
        }

        if (!title) {
            quizManager.showToast('Vui lòng nhập tên đề thi!', 'warning');
            document.getElementById('share-quiz-title').focus();
            return;
        }

        if (!category) {
            quizManager.showToast('Vui lòng chọn danh mục!', 'warning');
            document.getElementById('share-quiz-category').focus();
            return;
        }

        // Lưu tên người dùng
        this.currentUserName = userName;
        localStorage.setItem('userName', userName);

        // Cập nhật tên người dùng trong tab khám phá nếu có
        const userNameInputExplore = document.getElementById('user-name-input');
        if (userNameInputExplore) {
            userNameInputExplore.value = userName;
        }

        // Tạo quiz mới với tên và mô tả tùy chỉnh (không thay đổi quiz gốc)
        const sharedQuiz = {
            ...quiz,
            title: title,
            description: description || 'Không có mô tả',
            category: category
        };

        // KIỂM TRA LẠI Supabase mỗi lần chia sẻ (fix timing issue)
        const supabaseReady = window.supabaseQuizManager && window.supabaseQuizManager.isAvailable();

        if (supabaseReady) {
            this.isSupabaseAvailable = true;
            console.log('✅ Supabase detected, sharing to cloud...');
        }

        // Ưu tiên Supabase nếu có
        if (supabaseReady) {
            quizManager.showToast('☁️ Đang chia sẻ lên Supabase...', 'info');
            try {
                const result = await window.supabaseQuizManager.shareQuiz(sharedQuiz, userName);
                if (result.success) {
                    quizManager.showToast('✨ Đã chia sẻ lên Supabase thành công!', 'success');
                    this.closeShareModal();
                    this.switchToExploreTab();
                    await this.loadSharedQuizzes();
                    return;
                }
            } catch (error) {
                console.error('Supabase share failed:', error);
                quizManager.showToast('⚠️ Lỗi Supabase, thử Local Server...', 'warning');
            }
        }

        // Fallback sang Local Server
        quizManager.showToast('🔄 Đang kiểm tra Local Server...', 'info');
        const serverOnline = await this.checkServerStatus();

        if (!serverOnline) {
            // Chế độ offline - lưu local
            this.shareQuizOffline(sharedQuiz, userName);
            return;
        }

        // Thử chia sẻ lên server với retry
        await this.shareQuizOnline(sharedQuiz, userName);
    }

    // Chia sẻ quiz lên server (online mode)
    async shareQuizOnline(sharedQuiz, userName, retryAttempt = 0) {
        try {
            // Sử dụng Local server
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quiz: sharedQuiz,
                    userName: userName
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (data.success) {
                quizManager.showToast('✨ Chia sẻ đề thi thành công!', 'success');
                this.saveToOfflineStorage(data.quiz);
                this.closeShareModal();
                this.switchToExploreTab();
                this.loadSharedQuizzes();
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        } catch (error) {
            console.error('Error sharing quiz:', error);

            if (retryAttempt < this.maxRetries) {
                quizManager.showToast(`⚠️ Lỗi kết nối. Đang thử lại (${retryAttempt + 1}/${this.maxRetries})...`, 'warning');
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.shareQuizOnline(sharedQuiz, userName, retryAttempt + 1);
            }

            this.showShareErrorDialog(sharedQuiz, userName);
        }
    }

    // Hiển thị dialog lỗi với tùy ch���n
    showShareErrorDialog(sharedQuiz, userName) {
        const dialog = document.createElement('div');
        dialog.className = 'share-error-dialog';
        dialog.innerHTML = `
            <div class="share-error-content">
                <div class="share-error-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không Thể Kết Nối Server</h3>
                </div>
                <div class="share-error-body">
                    <p>Không thể chia sẻ quiz lên server sau ${this.maxRetries} lần thử.</p>
                    <p><strong>Bạn muốn làm gì?</strong></p>
                    
                    <div class="error-options">
                        <button class="btn btn-primary" onclick="exploreQuizManager.shareQuizOfflineFromDialog('${JSON.stringify(sharedQuiz).replace(/'/g, "\\'")}', '${userName}')">
                            <i class="fas fa-save"></i>
                            Lưu Offline (Chỉ trên máy này)
                        </button>
                        
                        <button class="btn btn-secondary" onclick="exploreQuizManager.showServerInstructions(); this.closest('.share-error-dialog').remove();">
                            <i class="fas fa-server"></i>
                            Hướng Dẫn Khởi Động Server
                        </button>
                        
                        <button class="btn btn-danger" onclick="this.closest('.share-error-dialog').remove();">
                            <i class="fas fa-times"></i>
                            Hủy Bỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    // Chia sẻ quiz offline
    shareQuizOffline(sharedQuiz, userName) {
        console.log('💾 Sharing quiz offline with category:', sharedQuiz.category);

        const offlineQuiz = {
            id: Date.now().toString(),
            originalId: sharedQuiz.id,
            title: sharedQuiz.title,
            description: sharedQuiz.description || 'Không có mô tả',
            category: sharedQuiz.category || 'khac', // Thêm danh mục
            questions: sharedQuiz.questions,
            totalQuestions: sharedQuiz.questions.length,
            userName: userName,
            sharedAt: new Date().toISOString(),
            views: 0,
            attempts: 0,
            isOffline: true
        };

        console.log('✅ Offline quiz created with category:', offlineQuiz.category);
        this.saveToOfflineStorage(offlineQuiz);

        quizManager.showToast('💾 Đã lưu quiz offline trên máy này!', 'success');

        // Đóng modal
        this.closeShareModal();

        // Chuyển sang tab khám phá
        this.switchToExploreTab();

        // Load offline quizzes
        this.loadOfflineQuizzes();
    }

    // Lưu quiz vào offline storage
    saveToOfflineStorage(quiz) {
        const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];

        // Kiểm tra trùng lặp
        const existingIndex = offlineQuizzes.findIndex(q => q.originalId === quiz.originalId);
        if (existingIndex >= 0) {
            offlineQuizzes[existingIndex] = quiz;
        } else {
            offlineQuizzes.push(quiz);
        }

        localStorage.setItem('offlineSharedQuizzes', JSON.stringify(offlineQuizzes));
    }

    // Chia sẻ offline từ dialog (helper function)
    shareQuizOfflineFromDialog(sharedQuizStr, userName) {
        try {
            const sharedQuiz = JSON.parse(sharedQuizStr);
            this.shareQuizOffline(sharedQuiz, userName);
            document.querySelector('.share-error-dialog')?.remove();
        } catch (error) {
            console.error('Error parsing quiz:', error);
            quizManager.showToast('Lỗi xử lý dữ liệu', 'error');
        }
    }

    // Xem chi tiết quiz
    async viewQuizDetails(quizId) {
        try {
            // Tăng lượt xem khi người dùng click vào xem chi tiết
            const newViewCount = await this.incrementViews(quizId);

            // Cập nhật UI ngay lập tức
            if (newViewCount !== null) {
                this.updateViewCountOnCard(quizId, newViewCount);
            }

            // Thử Supabase trước
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.getQuizById(quizId);
                    if (result.success) {
                        this.showQuizDetailsModal(result.quiz);
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase view details failed, trying local server:', error);
                }
            }

            // Fallback sang Local server
            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`);
            const data = await response.json();

            if (data.success) {
                this.showQuizDetailsModal(data.quiz);
            } else {
                quizManager.showToast('Không thể tải chi tiết quiz', 'error');
            }
        } catch (error) {
            console.error('Error loading quiz details:', error);

            // Thử lấy từ offline storage
            const offlineQuiz = this.getOfflineQuiz(quizId);
            if (offlineQuiz) {
                this.showQuizDetailsModal(offlineQuiz);
                quizManager.showToast('📱 Đang xem chi tiết offline', 'info');
            } else {
                quizManager.showToast('Lỗi khi tải chi tiết', 'error');
            }
        }
    }

    // Cập nhật số lượt xem trên card
    updateViewCountOnCard(quizId, newViewCount) {
        const viewsElement = document.querySelector(`.views-count[data-quiz-id="${quizId}"]`);
        if (viewsElement) {
            viewsElement.textContent = `${newViewCount} lượt xem`;
            viewsElement.classList.add('stat-updated');
            setTimeout(() => {
                viewsElement.classList.remove('stat-updated');
            }, 1000);
        }
    }

    // Tăng lượt xem
    async incrementViews(quizId) {
        try {
            // Kiểm tra xem đã xem quiz này chưa (trong session hiện tại)
            const viewedQuizzes = JSON.parse(sessionStorage.getItem('viewedQuizzes') || '[]');

            if (viewedQuizzes.includes(quizId)) {
                // Đã xem rồi, không tăng nữa trong session này
                console.log('⏭️ Quiz already viewed in this session');
                return null;
            }

            // Đánh dấu đã xem trong session
            viewedQuizzes.push(quizId);
            sessionStorage.setItem('viewedQuizzes', JSON.stringify(viewedQuizzes));

            let newViews = 0;

            // Thử Supabase trước
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.incrementViews(quizId);
                    if (result && result.success) {
                        newViews = result.views || 0;
                        console.log('✅ Increased views on Supabase:', newViews);

                        // Cập nhật trong danh sách local
                        const quiz = this.sharedQuizzes.find(q => q.id === quizId);
                        if (quiz) {
                            quiz.views = newViews;
                        }

                        return newViews;
                    }
                } catch (error) {
                    console.warn('Supabase increment views failed:', error);
                }
            }

            // Fallback sang Local server
            if (this.isServerOnline) {
                try {
                    const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}/view`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        newViews = data.views || 0;
                        console.log('✅ Increased views on Local Server:', newViews);

                        // Cập nhật trong danh sách local
                        const quiz = this.sharedQuizzes.find(q => q.id === quizId);
                        if (quiz) {
                            quiz.views = newViews;
                        }

                        return newViews;
                    }
                } catch (error) {
                    console.warn('Local server increment views failed:', error);
                }
            }

            // Nếu cả 2 đều fail, cập nhật local
            const quiz = this.sharedQuizzes.find(q => q.id === quizId);
            if (quiz) {
                quiz.views = (quiz.views || 0) + 1;
                newViews = quiz.views;
                console.log('📱 Increased views locally:', newViews);
                return newViews;
            }

            return null;
        } catch (error) {
            console.error('Error incrementing views:', error);
            return null;
        }
    }

    // Hiển thị modal chi tiết với xem trước đầy đủ
    showQuizDetailsModal(quiz) {
        const modal = document.getElementById('quiz-details-modal');
        if (!modal) return;

        const modalContent = modal.querySelector('.quiz-details-content');
        const date = new Date(quiz.sharedAt).toLocaleString('vi-VN');

        // Tính toán số lượng câu hỏi để xem trước (tối đa 5 câu)
        const previewCount = Math.min(5, quiz.questions.length);

        modalContent.innerHTML = `
            <div class="quiz-details-header">
                <div class="quiz-details-title-section">
                    <h2>${this.escapeHtml(quiz.title)}</h2>
                    <p class="quiz-details-description">${this.escapeHtml(quiz.description)}</p>
                </div>
                <button class="btn-close-modal" onclick="exploreQuizManager.closeDetailsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="quiz-details-info">
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-user"></i> Người chia sẻ:</span>
                    <span class="info-value">${this.escapeHtml(quiz.userName)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-calendar"></i> Ngày chia sẻ:</span>
                    <span class="info-value">${date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-question-circle"></i> Số câu hỏi:</span>
                    <span class="info-value">${quiz.totalQuestions} câu</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-eye"></i> Lượt xem:</span>
                    <span class="info-value">${quiz.views || 0}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-pen"></i> Lượt làm bài:</span>
                    <span class="info-value">${quiz.attempts || 0}</span>
                </div>
            </div>

            <div class="quiz-preview-section">
                <div class="quiz-preview-header">
                    <h3><i class="fas fa-eye"></i> Xem Trước Câu Hỏi</h3>
                    <span class="preview-badge">${previewCount}/${quiz.totalQuestions} câu</span>
                </div>
                
                <div class="quiz-preview-questions">
                    ${quiz.questions.slice(0, previewCount).map((q, index) => `
                        <div class="preview-question-item">
                            <div class="preview-question-header">
                                <div class="preview-question-number">
                                    <i class="fas fa-question"></i>
                                    <span>Câu ${index + 1}</span>
                                </div>
                                ${q.image ? '<span class="preview-has-image"><i class="fas fa-image"></i> Có hình ảnh</span>' : ''}
                            </div>
                            <div class="preview-question-text">${this.escapeHtml(q.question)}</div>
                            ${q.image ? `<div class="preview-question-image"><img src="${q.image}" alt="Hình câu hỏi" /></div>` : ''}
                            <div class="preview-options">
                                ${q.options.map((opt, optIndex) => {
            // Xử lý trường hợp opt là object hoặc string
            const optionText = typeof opt === 'object' ? (opt.text || opt.option || JSON.stringify(opt)) : opt;
            return `
                                        <div class="preview-option">
                                            <span class="preview-option-label">${String.fromCharCode(65 + optIndex)}.</span>
                                            <span class="preview-option-text">${this.escapeHtml(optionText)}</span>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${quiz.totalQuestions > previewCount ? `
                    <div class="more-questions-notice">
                        <i class="fas fa-info-circle"></i>
                        <span>Còn <strong>${quiz.totalQuestions - previewCount} câu hỏi</strong> nữa. Vào ôn thi để xem toàn bộ!</span>
                    </div>
                ` : ''}
            </div>

            <div class="quiz-details-actions">
                <button class="btn-start-quiz-primary" onclick="exploreQuizManager.startSharedQuiz('${quiz.id}'); exploreQuizManager.closeDetailsModal();">
                    <i class="fas fa-play-circle"></i>
                    <span>Vào Ôn Thi Ngay</span>
                </button>
                <button class="btn-close-quiz" onclick="exploreQuizManager.closeDetailsModal()">
                    <i class="fas fa-times-circle"></i>
                    <span>Đóng</span>
                </button>
            </div>
        `;

        modal.classList.add('active');
    }

    // Đóng modal chi tiết
    closeDetailsModal() {
        const modal = document.getElementById('quiz-details-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Bắt đầu làm bài từ quiz được chia sẻ
    async startSharedQuiz(quizId) {
        try {
            // Thử Supabase trước
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.getQuizById(quizId);
                    if (result.success) {
                        const quiz = result.quiz;

                        // Tăng số lượt làm bài
                        await window.supabaseQuizManager.incrementAttempts(quizId);

                        this.saveToOfflineStorage(quiz);
                        quizManager.currentQuiz = {
                            id: quiz.id,
                            title: quiz.title,
                            description: quiz.description,
                            questions: quiz.questions,
                            totalQuestions: quiz.totalQuestions,
                            isShared: true,
                            sharedBy: quiz.userName
                        };
                        quizManager.currentAnswers = {};
                        quizManager.switchTab('quiz');
                        quizManager.renderQuiz();
                        quizManager.showToast('🚀 Bắt đầu làm bài từ Supabase!', 'success');
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase start quiz failed, trying local server:', error);
                }
            }

            // Fallback sang Local server
            if (!this.isServerOnline) {
                const isOnline = await this.checkServerStatus();
                if (!isOnline) {
                    const offlineQuiz = this.getOfflineQuiz(quizId);
                    if (offlineQuiz) {
                        this.startOfflineQuiz(offlineQuiz);
                        return;
                    }
                    quizManager.showToast('❌ Không thể kết nối. Vui lòng cấu hình server URL.', 'error');
                    this.showServerURLDialog();
                    return;
                }
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (data.success) {
                const quiz = data.quiz;
                try {
                    await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}/attempt`, {
                        method: 'POST'
                    });
                } catch (err) {
                    console.warn('Could not update attempt count:', err);
                }
                this.saveToOfflineStorage(quiz);
                quizManager.currentQuiz = {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    questions: quiz.questions,
                    totalQuestions: quiz.totalQuestions,
                    isShared: true,
                    sharedBy: quiz.userName
                };
                quizManager.currentAnswers = {};
                quizManager.switchTab('quiz');
                quizManager.renderQuiz();
                quizManager.showToast('🚀 Bắt đầu làm bài!', 'success');
            } else {
                throw new Error(data.error || 'Không thể tải quiz');
            }
        } catch (error) {
            console.error('Error starting shared quiz:', error);
            const offlineQuiz = this.getOfflineQuiz(quizId);
            if (offlineQuiz) {
                quizManager.showToast('⚠️ Đang dùng bản offline', 'warning');
                this.startOfflineQuiz(offlineQuiz);
                return;
            }
            this.showStartQuizErrorDialog(quizId, error);
        }
    }

    // Lấy quiz từ offline storage
    getOfflineQuiz(quizId) {
        const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];
        return offlineQuizzes.find(q => q.id === quizId);
    }

    // Bắt đầu quiz offline
    startOfflineQuiz(quiz) {
        quizManager.currentQuiz = {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions,
            totalQuestions: quiz.totalQuestions,
            isShared: true,
            isOffline: true,
            sharedBy: quiz.userName
        };

        quizManager.currentAnswers = {};

        // Chuyển sang tab làm bài và render quiz
        quizManager.switchTab('quiz');
        quizManager.renderQuiz();

        quizManager.showToast('📱 Đang làm bài offline', 'info');
    }

    // Hiển thị dialog lỗi khi không thể bắt đầu quiz
    showStartQuizErrorDialog(quizId, error) {
        const dialog = document.createElement('div');
        dialog.className = 'share-error-dialog';
        dialog.innerHTML = `
            <div class="share-error-content">
                <div class="share-error-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không Thể Tải Quiz</h3>
                </div>
                <div class="share-error-body">
                    <p><strong>Lỗi:</strong> ${error.message || 'Không thể kết nối server'}</p>
                    <p>Vui lòng thử một trong các cách sau:</p>
                    
                    <div class="error-options">
                        <button class="btn btn-primary" onclick="exploreQuizManager.showServerURLDialog(); this.closest('.share-error-dialog').remove();">
                            <i class="fas fa-cog"></i>
                            Cấu Hình Server
                        </button>
                        
                        <button class="btn btn-secondary" onclick="exploreQuizManager.retryStartQuiz('${quizId}'); this.closest('.share-error-dialog').remove();">
                            <i class="fas fa-sync"></i>
                            Thử Lại
                        </button>
                        
                        <button class="btn btn-danger" onclick="this.closest('.share-error-dialog').remove();">
                            <i class="fas fa-times"></i>
                            Đóng
                        </button>
                    </div>

                    <div class="instruction-note" style="margin-top: 20px;">
                        <i class="fas fa-info-circle"></i>
                        <p><strong>Gợi ý:</strong> Nếu bạn đang truy cập từ máy khác, hãy cấu hình địa chỉ IP của server. Ví dụ: http://192.168.1.100:3000</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    // Thử lại bắt đầu quiz
    async retryStartQuiz(quizId) {
        await this.checkServerStatus();
        await this.startSharedQuiz(quizId);
    }

    // Bắt đầu chế độ ôn thi (practice mode)
    async startPracticeMode(quizId) {
        try {
            // Thử Supabase trước
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.getQuizById(quizId);
                    if (result.success) {
                        const quiz = result.quiz;

                        // Tăng số lượt xem (không tăng attempts cho practice mode)
                        await window.supabaseQuizManager.incrementViews(quizId);

                        this.saveToOfflineStorage(quiz);
                        quizManager.currentQuiz = {
                            id: quiz.id,
                            title: quiz.title + ' (Chế độ ôn thi)',
                            description: quiz.description,
                            questions: quiz.questions,
                            totalQuestions: quiz.totalQuestions,
                            isShared: true,
                            sharedBy: quiz.userName,
                            isPracticeMode: true
                        };
                        quizManager.currentAnswers = {};
                        quizManager.switchTab('quiz');
                        quizManager.renderQuiz();
                        quizManager.showToast('📚 Bắt đầu ôn thi! Bạn có thể xem đáp án ngay lập tức.', 'info');
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase practice mode failed, trying local server:', error);
                }
            }

            // Fallback sang Local server
            if (!this.isServerOnline) {
                const isOnline = await this.checkServerStatus();
                if (!isOnline) {
                    const offlineQuiz = this.getOfflineQuiz(quizId);
                    if (offlineQuiz) {
                        this.startOfflinePractice(offlineQuiz);
                        return;
                    }
                    quizManager.showToast('❌ Không thể kết nối. Vui lòng cấu hình server URL.', 'error');
                    this.showServerURLDialog();
                    return;
                }
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (data.success) {
                const quiz = data.quiz;

                // Tăng views cho practice mode
                try {
                    await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}/view`, {
                        method: 'POST'
                    });
                } catch (err) {
                    console.warn('Could not update view count:', err);
                }

                this.saveToOfflineStorage(quiz);
                quizManager.currentQuiz = {
                    id: quiz.id,
                    title: quiz.title + ' (Chế độ ôn thi)',
                    description: quiz.description,
                    questions: quiz.questions,
                    totalQuestions: quiz.totalQuestions,
                    isShared: true,
                    sharedBy: quiz.userName,
                    isPracticeMode: true
                };
                quizManager.currentAnswers = {};
                quizManager.switchTab('quiz');
                quizManager.renderQuiz();
                quizManager.showToast('📚 Bắt đầu ôn thi! Bạn có thể xem đáp án ngay lập tức.', 'info');
            } else {
                throw new Error(data.message || 'Không thể tải quiz');
            }
        } catch (error) {
            console.error('Error starting practice mode:', error);
            if (error.name === 'AbortError') {
                quizManager.showToast('⏱️ Kết nối quá chậm. Vui lòng thử lại.', 'error');
            } else {
                quizManager.showToast('❌ Lỗi khi bắt đầu ôn thi: ' + error.message, 'error');
            }
        }
    }

    // Bắt đầu ôn thi offline
    startOfflinePractice(quiz) {
        quizManager.currentQuiz = {
            id: quiz.id,
            title: quiz.title + ' (Chế độ ôn thi - Offline)',
            description: quiz.description,
            questions: quiz.questions,
            totalQuestions: quiz.totalQuestions,
            isShared: true,
            sharedBy: quiz.userName,
            isPracticeMode: true
        };
        quizManager.currentAnswers = {};
        quizManager.switchTab('quiz');
        quizManager.renderQuiz();
        quizManager.showToast('📚 Bắt đầu ôn thi offline! Bạn có thể xem đáp án ngay lập tức.', 'info');
    }

    // Chuyển sang tab khám phá
    switchToExploreTab() {
        quizManager.switchTab('explore');
    }

    // Hiển thị loading
    showLoading(show) {
        const loader = document.getElementById('explore-loading');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    // Hiển thị lỗi
    showError(message) {
        const container = document.getElementById('shared-quizzes-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-state-card">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Có lỗi xảy ra</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="exploreQuizManager.loadSharedQuizzes()">
                        <i class="fas fa-sync"></i>
                        Thử lại
                    </button>
                </div>
            `;
        }
    }

    // Tính thời gian đã trôi qua
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
        if (seconds < 2592000) return `${Math.floor(seconds / 604800)} tuần trước`;
        return `${Math.floor(seconds / 2592000)} tháng trước`;
    }

    // Escape HTML để tránh XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu quiz không
    isQuizOwner(quiz) {
        // ⭐ ADMIN CÓ QUYỀN TUYỆT ĐỐI - Có thể làm mọi thứ
        if (window.adminManager && window.adminManager.isAdminMode) {
            console.log('👑 Admin mode: Full access granted');
            return true;
        }

        // Kiểm tra theo userName
        if (this.currentUserName && quiz.userName) {
            return this.currentUserName.toLowerCase() === quiz.userName.toLowerCase();
        }

        // Kiểm tra theo originalId nếu là quiz offline
        if (quiz.isOffline && quiz.originalId) {
            const localQuizzes = quizManager.quizzes || [];
            return localQuizzes.some(q => q.id === quiz.originalId);
        }

        return false;
    }

    // Hiển thị menu chỉnh sửa/xóa
    showEditDeleteMenu(quizId, event) {
        event.stopPropagation();

        // Xóa menu cũ nếu có
        const oldMenu = document.querySelector('.quiz-action-menu');
        if (oldMenu) {
            oldMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'quiz-action-menu';
        menu.innerHTML = `
            <button class="menu-item menu-edit" onclick="exploreQuizManager.editQuiz('${quizId}')">
                <i class="fas fa-edit"></i>
                <span>Chỉnh sửa</span>
            </button>
            <button class="menu-item menu-delete" onclick="exploreQuizManager.confirmDeleteQuiz('${quizId}')">
                <i class="fas fa-trash"></i>
                <span>Xóa bài</span>
            </button>
        `;

        // Đặt vị trí menu
        const button = event.target.closest('.btn-edit-quiz');
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;

        document.body.appendChild(menu);

        // Đóng menu khi click ra ngoài
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    // Chỉnh sửa quiz
    async editQuiz(quizId) {
        try {
            // Đóng menu
            document.querySelector('.quiz-action-menu')?.remove();

            // Lấy thông tin quiz
            let quiz = this.sharedQuizzes.find(q => q.id === quizId);

            if (!quiz) {
                // Thử lấy từ server
                if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                    const result = await window.supabaseQuizManager.getQuizById(quizId);
                    if (result.success) {
                        quiz = result.quiz;
                    }
                } else if (this.isServerOnline) {
                    const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`);
                    const data = await response.json();
                    if (data.success) {
                        quiz = data.quiz;
                    }
                }
            }

            if (!quiz) {
                quizManager.showToast('Không tìm thấy quiz!', 'error');
                return;
            }

            // Kiểm tra quyền sở hữu
            if (!this.isQuizOwner(quiz)) {
                quizManager.showToast('Bạn không có quyền chỉnh sửa bài này!', 'error');
                return;
            }

            // Hiển thị modal chỉnh sửa
            this.showEditQuizModal(quiz);

        } catch (error) {
            console.error('Error editing quiz:', error);
            quizManager.showToast('Lỗi khi tải thông tin quiz', 'error');
        }
    }

    // Hiển thị modal chỉnh sửa
    showEditQuizModal(quiz) {
        const modal = document.createElement('div');
        modal.className = 'edit-quiz-modal';
        modal.innerHTML = `
            <div class="edit-quiz-content">
                <div class="edit-quiz-header">
                    <h3><i class="fas fa-edit"></i> Chỉnh Sửa Bài Thi</h3>
                    <button class="btn-close" onclick="this.closest('.edit-quiz-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="edit-quiz-body">
                    <div class="form-group">
                        <label><i class="fas fa-heading"></i> Tên bài thi:</label>
                        <input type="text" id="edit-quiz-title" value="${this.escapeHtml(quiz.title)}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-align-left"></i> Mô tả:</label>
                        <textarea id="edit-quiz-description" class="form-textarea" rows="3">${this.escapeHtml(quiz.description || '')}</textarea>
                    </div>
                    <div class="quiz-info-summary">
                        <div class="info-item">
                            <i class="fas fa-question-circle"></i>
                            <span>${quiz.totalQuestions} câu hỏi</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <span>Người tạo: ${this.escapeHtml(quiz.userName)}</span>
                        </div>
                    </div>
                </div>
                <div class="edit-quiz-footer">
                    <button class="btn btn-primary" onclick="exploreQuizManager.saveEditedQuiz('${quiz.id}')">
                        <i class="fas fa-save"></i> Lưu thay đổi
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.edit-quiz-modal').remove()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Lưu quiz đã chỉnh sửa
    async saveEditedQuiz(quizId) {
        try {
            const title = document.getElementById('edit-quiz-title').value.trim();
            const description = document.getElementById('edit-quiz-description').value.trim();

            if (!title) {
                quizManager.showToast('Vui lòng nhập tên bài thi!', 'warning');
                return;
            }

            quizManager.showToast('🔄 Đang cập nhật...', 'info');

            // Cập nhật trên Supabase
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.updateQuiz(quizId, {
                        title: title,
                        description: description
                    });

                    if (result.success) {
                        quizManager.showToast('✅ Đã cập nhật thành công!', 'success');
                        document.querySelector('.edit-quiz-modal')?.remove();
                        await this.loadSharedQuizzes();
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase update failed:', error);
                }
            }

            // Fallback sang Local Server
            if (this.isServerOnline) {
                const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                });

                const data = await response.json();

                if (data.success) {
                    quizManager.showToast('✅ Đã cập nhật thành công!', 'success');
                    document.querySelector('.edit-quiz-modal')?.remove();
                    await this.loadSharedQuizzes();
                    return;
                }
            }

            // Cập nhật offline
            const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];
            const index = offlineQuizzes.findIndex(q => q.id === quizId);

            if (index !== -1) {
                offlineQuizzes[index].title = title;
                offlineQuizzes[index].description = description;
                localStorage.setItem('offlineSharedQuizzes', JSON.stringify(offlineQuizzes));

                quizManager.showToast('✅ Đã cập nhật offline!', 'success');
                document.querySelector('.edit-quiz-modal')?.remove();
                this.loadOfflineQuizzes();
            } else {
                quizManager.showToast('❌ Không thể cập nhật!', 'error');
            }

        } catch (error) {
            console.error('Error saving edited quiz:', error);
            quizManager.showToast('❌ Lỗi khi lưu thay đổi!', 'error');
        }
    }

    // ⭐ XÓA QUIZ ĐƯỢC CHIA SẺ - HÀM MỚI
    async deleteSharedQuiz(quizId) {
        if (!quizId) {
            throw new Error('Quiz ID không hợp lệ');
        }

        try {
            console.log('🗑️ Deleting shared quiz:', quizId);

            // Ưu tiên xóa từ Supabase nếu có
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.deleteQuiz(quizId);
                    if (result.success) {
                        console.log('✅ Deleted from Supabase successfully');

                        // Xóa khỏi danh sách local
                        this.sharedQuizzes = this.sharedQuizzes.filter(q => q.id !== quizId);

                        // Xóa khỏi offline storage
                        this.removeFromOfflineStorage(quizId);

                        // Render lại danh sách
                        this.renderSharedQuizzes(this.sharedQuizzes);

                        return {
                            success: true,
                            message: 'Đã xóa quiz khỏi Supabase'
                        };
                    }
                } catch (error) {
                    console.error('Supabase delete failed:', error);

                    // Nếu lỗi permission, thông báo rõ ràng
                    if (error.message && error.message.includes('permission')) {
                        throw new Error('Bạn không có quyền xóa bài này. Vui lòng kiểm tra RLS policy trong Supabase.');
                    }

                    // Nếu Supabase fail, thử Local Server
                    console.warn('Trying Local Server...');
                }
            }

            // Fallback sang Local Server
            if (this.isServerOnline) {
                try {
                    const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        console.log('✅ Deleted from Local Server successfully');

                        // Xóa khỏi danh sách local
                        this.sharedQuizzes = this.sharedQuizzes.filter(q => q.id !== quizId);

                        // Xóa khỏi offline storage
                        this.removeFromOfflineStorage(quizId);

                        // Render lại danh sách
                        this.renderSharedQuizzes(this.sharedQuizzes);

                        return {
                            success: true,
                            message: 'Đã xóa quiz khỏi Local Server'
                        };
                    } else {
                        throw new Error(data.error || 'Không thể xóa quiz từ server');
                    }
                } catch (error) {
                    console.error('Local Server delete failed:', error);
                    throw error;
                }
            }

            // Nếu cả 2 đều không khả dụng, xóa offline
            console.log('📱 Deleting from offline storage only');
            this.removeFromOfflineStorage(quizId);
            this.sharedQuizzes = this.sharedQuizzes.filter(q => q.id !== quizId);
            this.renderSharedQuizzes(this.sharedQuizzes);

            return {
                success: true,
                message: 'Đã xóa quiz khỏi bộ nhớ local'
            };

        } catch (error) {
            console.error('❌ Error deleting shared quiz:', error);
            throw error;
        }
    }

    // Xóa quiz khỏi offline storage
    removeFromOfflineStorage(quizId) {
        try {
            const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];
            const updatedQuizzes = offlineQuizzes.filter(q => q.id !== quizId && q.originalId !== quizId);
            localStorage.setItem('offlineSharedQuizzes', JSON.stringify(updatedQuizzes));
            console.log('✅ Removed from offline storage');
        } catch (error) {
            console.error('Error removing from offline storage:', error);
        }
    }

    // Xác nhận xóa quiz
    confirmDeleteQuiz(quizId) {
        // Đóng menu
        document.querySelector('.quiz-action-menu')?.remove();

        const quiz = this.sharedQuizzes.find(q => q.id === quizId);

        if (!quiz) {
            quizManager.showToast('Không tìm thấy quiz!', 'error');
            return;
        }

        // Kiểm tra quyền sở hữu
        if (!this.isQuizOwner(quiz)) {
            quizManager.showToast('Bạn không có quyền xóa bài này!', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'confirm-delete-modal';
        modal.innerHTML = `
            <div class="confirm-delete-content">
                <div class="confirm-delete-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Xác Nhận Xóa Bài Thi</h3>
                </div>
                <div class="confirm-delete-body">
                    <p>Bạn có chắc chắn muốn xóa bài thi này?</p>
                    <div class="quiz-delete-info">
                        <strong>${this.escapeHtml(quiz.title)}</strong>
                        <span>${quiz.totalQuestions} câu hỏi</span>
                    </div>
                    <p class="warning-text">
                        <i class="fas fa-info-circle"></i>
                        Hành động này không thể hoàn tác!
                    </p>
                </div>
                <div class="confirm-delete-footer">
                    <button class="btn btn-danger" onclick="exploreQuizManager.deleteQuiz('${quizId}')">
                        <i class="fas fa-trash"></i> Xóa bài
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.confirm-delete-modal').remove()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Xóa quiz
    async deleteQuiz(quizId) {
        try {
            quizManager.showToast('🔄 Đang xóa...', 'info');

            // Xóa trên Supabase
            if (this.isSupabaseAvailable && window.supabaseQuizManager) {
                try {
                    const result = await window.supabaseQuizManager.deleteQuiz(quizId);

                    if (result.success) {
                        quizManager.showToast('✅ Đã xóa thành công!', 'success');
                        document.querySelector('.confirm-delete-modal')?.remove();
                        await this.loadSharedQuizzes();
                        return;
                    }
                } catch (error) {
                    console.warn('Supabase delete failed:', error);
                }
            }

            // Fallback sang Local Server
            if (this.isServerOnline) {
                const response = await fetch(`${this.API_BASE_URL}/shared-quizzes/${quizId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    quizManager.showToast('✅ Đã xóa thành công!', 'success');
                    document.querySelector('.confirm-delete-modal')?.remove();
                    await this.loadSharedQuizzes();
                    return;
                }
            }

            // Xóa offline
            let offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes')) || [];
            offlineQuizzes = offlineQuizzes.filter(q => q.id !== quizId);
            localStorage.setItem('offlineSharedQuizzes', JSON.stringify(offlineQuizzes));

            quizManager.showToast('✅ Đã xóa offline!', 'success');
            document.querySelector('.confirm-delete-modal')?.remove();
            this.loadOfflineQuizzes();

        } catch (error) {
            console.error('Error deleting quiz:', error);
            quizManager.showToast('❌ Lỗi khi xóa bài thi!', 'error');
        }
    }

    // ===== CATEGORY SUPPORT METHODS =====

    // Lấy tên danh mục
    getCategoryName(category) {
        const categoryNames = {
            all: 'Tất cả',
            'toan-cao-cap': 'Toán cao cấp',
            'vat-ly-dai-cuong': 'Vật lý đại cương',
            'hoa-dai-cuong': 'Hóa đại cương',
            'sinh-hoc-dai-cuong': 'Sinh học đại cương',
            'tieng-anh': 'Tiếng Anh',
            'tin-hoc-dai-cuong': 'Tin học đại cương',
            'kinh-te-hoc': 'Kinh tế học',
            'quan-tri-kinh-doanh': 'Quản trị kinh doanh',
            'ke-toan': 'Kế toán',
            'marketing': 'Marketing',
            'luat-hoc': 'Luật học',
            'tam-ly-hoc': 'Tâm lý học',
            'giao-duc-hoc': 'Giáo dục học',
            'ngoai-ngu': 'Ngoại ngữ',
            'cong-nghe-thong-tin': 'Công nghệ thông tin',
            'dien-tu-vien-thong': 'Điện tử viễn thông',
            'co-khi': 'Cơ khí',
            'xay-dung': 'Xây dựng',
            'y-hoc': 'Y học',
            'duoc-hoc': 'Dược học',
            'nong-nghiep': 'Nông nghiệp',
            'thuy-san': 'Thủy sản',
            'lam-nghiep': 'Lâm nghiệp',
            'moi-truong': 'Môi trường',
            'khac': 'Khác'
        };
        return categoryNames[category] || 'Khác';
    }

    // Lấy icon danh mục
    getCategoryIcon(category) {
        const categoryIcons = {
            'toan-cao-cap': 'fas fa-calculator',
            'vat-ly-dai-cuong': 'fas fa-atom',
            'hoa-dai-cuong': 'fas fa-flask',
            'sinh-hoc-dai-cuong': 'fas fa-dna',
            'tieng-anh': 'fas fa-globe-americas',
            'tin-hoc-dai-cuong': 'fas fa-laptop-code',
            'kinh-te-hoc': 'fas fa-chart-line',
            'quan-tri-kinh-doanh': 'fas fa-briefcase',
            'ke-toan': 'fas fa-calculator',
            'marketing': 'fas fa-bullhorn',
            'luat-hoc': 'fas fa-balance-scale',
            'tam-ly-hoc': 'fas fa-brain',
            'giao-duc-hoc': 'fas fa-graduation-cap',
            'ngoai-ngu': 'fas fa-language',
            'cong-nghe-thong-tin': 'fas fa-code',
            'dien-tu-vien-thong': 'fas fa-broadcast-tower',
            'co-khi': 'fas fa-cogs',
            'xay-dung': 'fas fa-hammer',
            'y-hoc': 'fas fa-user-md',
            'duoc-hoc': 'fas fa-pills',
            'nong-nghiep': 'fas fa-seedling',
            'thuy-san': 'fas fa-fish',
            'lam-nghiep': 'fas fa-tree',
            'moi-truong': 'fas fa-leaf',
            'khac': 'fas fa-book'
        };
        return categoryIcons[category] || 'fas fa-book';
    }

    // Lấy text độ khó
    getDifficultyText(difficulty) {
        const difficultyTexts = {
            'easy': 'Dễ',
            'medium': 'Trung bình',
            'hard': 'Khó',
            'expert': 'Chuyên gia'
        };
        return difficultyTexts[difficulty] || 'Trung bình';
    }

    // Khởi tạo bộ lọc danh mục
    initializeCategoryFilter() {
        console.log('🔧 Initializing category filter...');

        // Thêm event listener cho dropdown
        const categorySelect = document.getElementById('category-filter-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                const selectedCategory = e.target.value;
                console.log('📂 Category selected:', selectedCategory);
                this.filterByCategory(selectedCategory);
            });
            console.log('✅ Category dropdown initialized');
        } else {
            console.warn('⚠️ Category dropdown not found');
        }

        // Cập nhật số lượng ban đầu
        this.updateCategoryCounts();
    }

    // Lọc quiz theo danh mục
    filterByCategory(category) {
        console.log('🔍 Filtering by category:', category);
        console.log('📊 Total quizzes:', this.sharedQuizzes.length);

        // Lọc và hiển thị quiz
        let filteredQuizzes;
        if (category === 'all') {
            filteredQuizzes = this.sharedQuizzes;
        } else {
            filteredQuizzes = this.sharedQuizzes.filter(quiz => {
                const quizCategory = quiz.category || 'khac';
                console.log(`📝 Quiz "${quiz.title}" - Category: ${quizCategory}`);
                return quizCategory === category;
            });
        }

        console.log('✅ Filtered quizzes:', filteredQuizzes.length);

        this.renderSharedQuizzes(filteredQuizzes);

        // Cập nhật text hiển thị kết quả
        this.updateFilterResultText(category, filteredQuizzes.length);
    }

    // Cập nhật text kết quả lọc
    updateFilterResultText(category, count) {
        const resultText = document.getElementById('filter-result-text');
        if (resultText) {
            if (category === 'all') {
                resultText.textContent = `Hiển thị tất cả ${count} tài liệu`;
            } else {
                const categoryName = this.getCategoryName(category);
                resultText.textContent = `${categoryName}: ${count} tài liệu`;
            }
        }
    }

    // Cập nhật số lượng quiz theo danh mục
    updateCategoryCounts() {
        console.log('📊 Updating category counts...');

        // Chỉ cập nhật text hiển thị tổng số
        const totalCount = this.sharedQuizzes.length;
        this.updateFilterResultText('all', totalCount);

        // Debug: Log tất cả quiz và danh mục của chúng
        console.log('📋 Quiz categories:');
        this.sharedQuizzes.forEach((quiz, index) => {
            console.log(`${index + 1}. "${quiz.title}" - Category: ${quiz.category || 'khac'}`);
        });
    }
}

// Khởi tạo explore quiz manager
let exploreQuizManager;
document.addEventListener('DOMContentLoaded', () => {
    try {
        exploreQuizManager = new ExploreQuizManager();

        // Expose ngay sau khi khởi tạo
        window.exploreQuizManager = exploreQuizManager;

        // Đợi một chút để đảm bảo DOM đã sẵn sàng
        setTimeout(() => {
            if (exploreQuizManager) {
                exploreQuizManager.initialize();
                console.log('✅ Explore Quiz Manager initialized successfully');
            }
        }, 500);
    } catch (error) {
        console.error('❌ Error initializing Explore Quiz Manager:', error);
    }
});
