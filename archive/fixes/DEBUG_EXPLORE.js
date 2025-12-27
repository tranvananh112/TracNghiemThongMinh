// ============================================================================
// DEBUG SCRIPT - Kiểm tra tại sao không load được quiz từ Supabase
// ============================================================================
// Chạy script này trong Console (F12) để debug

console.log('🔍 ===== BẮT ĐẦU DEBUG EXPLORE QUIZ =====');

// 1. Kiểm tra Supabase Manager
console.log('\n📦 1. KIỂM TRA SUPABASE MANAGER:');
console.log('   - window.supabaseQuizManager:', window.supabaseQuizManager ? '✅ Có' : '❌ Không có');

if (window.supabaseQuizManager) {
    console.log('   - isAvailable():', window.supabaseQuizManager.isAvailable() ? '✅ Sẵn sàng' : '❌ Chưa sẵn sàng');
    console.log('   - supabase client:', window.supabaseQuizManager.supabase ? '✅ Có' : '❌ Không có');
}

// 2. Kiểm tra Explore Manager
console.log('\n🔍 2. KIỂM TRA EXPLORE MANAGER:');
console.log('   - window.exploreQuizManager:', window.exploreQuizManager ? '✅ Có' : '❌ Không có');

if (window.exploreQuizManager) {
    console.log('   - isSupabaseAvailable:', exploreQuizManager.isSupabaseAvailable ? '✅ True' : '❌ False');
    console.log('   - sharedQuizzes.length:', exploreQuizManager.sharedQuizzes.length);
    console.log('   - isServerOnline:', exploreQuizManager.isServerOnline);
}

// 3. Test lấy quiz từ Supabase
console.log('\n📥 3. TEST LẤY QUIZ TỪ SUPABASE:');

if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
    window.supabaseQuizManager.getAllQuizzes(50).then(result => {
        console.log('   ✅ Kết quả từ Supabase:');
        console.log('   - Success:', result.success);
        console.log('   - Số quiz:', result.quizzes.length);
        console.log('   - Danh sách:', result.quizzes);

        if (result.quizzes.length === 0) {
            console.log('\n   ⚠️ KHÔNG CÓ QUIZ NÀO TRONG SUPABASE!');
            console.log('   → Hãy mở: http://localhost:3000/test-share-quiz.html');
            console.log('   → Click "📤 Chia Sẻ Quiz Test" để tạo quiz mẫu');
        } else {
            console.log('\n   ✅ CÓ QUIZ TRONG SUPABASE!');
            console.log('   → Vấn đề: Explore Manager không load được');
        }
    }).catch(error => {
        console.log('   ❌ Lỗi khi lấy quiz:', error);
    });
} else {
    console.log('   ❌ Supabase không sẵn sàng!');
}

// 4. Kiểm tra localStorage
console.log('\n💾 4. KIỂM TRA LOCALSTORAGE:');
const offlineQuizzes = JSON.parse(localStorage.getItem('offlineSharedQuizzes') || '[]');
console.log('   - Offline quizzes:', offlineQuizzes.length);

if (offlineQuizzes.length > 0) {
    console.log('   ⚠️ Có quiz offline - có thể đang hiển thị offline thay vì Supabase');
}

// 5. Force reload từ Supabase
console.log('\n🔄 5. FORCE RELOAD TỪ SUPABASE:');

async function forceReloadFromSupabase() {
    if (!window.supabaseQuizManager || !window.supabaseQuizManager.isAvailable()) {
        console.log('   ❌ Supabase không sẵn sàng');
        return;
    }

    if (!window.exploreQuizManager) {
        console.log('   ❌ Explore Manager không tồn tại');
        return;
    }

    console.log('   🔄 Đang force reload...');

    // Set flag
    exploreQuizManager.isSupabaseAvailable = true;

    // Load lại
    await exploreQuizManager.loadSharedQuizzes();

    console.log('   ✅ Đã reload! Kiểm tra trang web.');
}

console.log('   → Chạy: forceReloadFromSupabase()');
window.forceReloadFromSupabase = forceReloadFromSupabase;

// 6. Hướng dẫn
console.log('\n📝 6. HƯỚNG DẪN TIẾP THEO:');
console.log('   1. Xem kết quả ở trên');
console.log('   2. Nếu "Số quiz: 0" → Chạy: window.open("http://localhost:3000/test-share-quiz.html")');
console.log('   3. Nếu có quiz nhưng không hiển thị → Chạy: forceReloadFromSupabase()');
console.log('   4. Nếu vẫn không được → Copy toàn bộ log và gửi cho tôi');

console.log('\n🔍 ===== KẾT THÚC DEBUG =====\n');
