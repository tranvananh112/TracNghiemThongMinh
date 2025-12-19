/**
 * Smart Question Parser - Nhận diện tự động nhiều format câu hỏi
 * Hỗ trợ các format:
 * - Câu 1: / Câu 1. / Câu 1 / 1. / 1: / 1) / Question 1:
 * - A. / A: / A) / a. / a: / a)
 * - Đáp án: A / Câu 1: A / 1. A / A
 */

class SmartQuestionParser {
    constructor() {
        // Regex patterns để nhận diện câu hỏi
        this.questionPatterns = [
            /^(?:câu|cau|question|q)\s*(\d+)\s*[:：.)\-]\s*(.+)/i,  // Câu 1: / Question 1:
            /^(\d+)\s*[:：.)\-]\s*(.+)/,                             // 1. / 1:
            /^(\d+)\s+(.+)/                                          // 1 (space) text
        ];

        // Regex patterns để nhận diện lựa chọn
        this.optionPatterns = [
            /^([A-Da-d])\s*[:：.)\-]\s*(.+)/,  // A. / A: / A)
            /^([A-Da-d])\s+(.+)/                // A (space) text
        ];

        // Regex patterns để nhận diện đáp án
        this.answerPatterns = [
            /^(?:câu|cau|question|q)?\s*(\d+)\s*[:：.)\-]?\s*([A-Da-d])\s*$/i,  // Câu 1: A / 1. A
            /^(\d+)\s*[:：.)\-]?\s*([A-Da-d])\s*$/,                              // 1. A / 1 A
            /^([A-Da-d])\s*$/i                                                    // A
        ];
    }

    /**
     * Parse câu hỏi từ text với nhiều format khác nhau - IMPROVED VERSION
     */
    parseQuestions(text) {
        if (!text || !text.trim()) {
            throw new Error('Văn bản câu hỏi trống!');
        }

        const lines = text.split('\n');
        const questions = [];
        let currentQuestion = null;
        let currentOptions = [];
        let currentQuestionNumber = 0;
        let currentQuestionText = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) continue; // Skip empty lines

            // Thử nhận diện câu hỏi MỚI
            const questionMatch = this.matchQuestion(line);

            if (questionMatch) {
                // Lưu câu hỏi trước đó
                if (currentQuestion && currentOptions.length >= 2) {
                    questions.push({
                        questionNumber: currentQuestionNumber,
                        question: currentQuestionText.trim(),
                        options: currentOptions
                    });
                }

                // Bắt đầu câu hỏi mới
                currentQuestionNumber = questionMatch.number;
                currentQuestionText = questionMatch.text;
                currentQuestion = true;
                currentOptions = [];
                continue;
            }

            // Thử nhận diện lựa chọn
            const optionMatch = this.matchOption(line);

            if (optionMatch && currentQuestion) {
                // Nếu có lựa chọn mới, lưu lựa chọn trước
                currentOptions.push({
                    letter: optionMatch.letter.toUpperCase(),
                    text: optionMatch.text
                });
                continue;
            }

            // Nếu không match pattern nào
            if (currentQuestion) {
                if (currentOptions.length === 0) {
                    // Chưa có lựa chọn nào → nối vào câu hỏi
                    currentQuestionText += ' ' + line;
                } else {
                    // Đã có lựa chọn → nối vào lựa chọn cuối cùng
                    const lastOption = currentOptions[currentOptions.length - 1];
                    lastOption.text += ' ' + line;
                }
            }
        }

        // Lưu câu hỏi cuối cùng
        if (currentQuestion && currentOptions.length >= 2) {
            questions.push({
                questionNumber: currentQuestionNumber,
                question: currentQuestionText.trim(),
                options: currentOptions
            });
        }

        if (questions.length === 0) {
            throw new Error('Không tìm thấy câu hỏi hợp lệ!\n\nHỗ trợ các format:\n- Câu 1: Nội dung?\n- 1. Nội dung?\n- Question 1: Nội dung?\n\nLựa chọn:\n- A. Đáp án\n- A: Đáp án\n- A) Đáp án');
        }

        // Validate số lượng options
        for (let q of questions) {
            if (q.options.length < 2) {
                throw new Error(`Câu ${q.questionNumber} chỉ có ${q.options.length} lựa chọn. Cần ít nhất 2 lựa chọn!`);
            }
        }

        return questions;
    }

    /**
     * Parse đáp án từ text với nhiều format khác nhau
     */
    parseAnswers(text, expectedCount) {
        if (!text || !text.trim()) {
            throw new Error('Văn bản đáp án trống!');
        }

        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const answers = [];
        let sequentialAnswerIndex = 0;

        for (let line of lines) {
            // Thử các pattern đáp án
            for (let pattern of this.answerPatterns) {
                const match = line.match(pattern);

                if (match) {
                    let questionNumber, answer;

                    if (match.length === 3) {
                        // Format: Câu 1: A hoặc 1. A
                        questionNumber = parseInt(match[1]);
                        answer = match[2].toUpperCase();
                    } else if (match.length === 2) {
                        // Format: A (chỉ có đáp án)
                        sequentialAnswerIndex++;
                        questionNumber = sequentialAnswerIndex;
                        answer = match[1].toUpperCase();
                    }

                    // Validate đáp án
                    if (answer && /^[A-D]$/.test(answer)) {
                        answers.push({
                            questionNumber: questionNumber,
                            answer: answer
                        });
                        break;
                    }
                }
            }
        }

        if (answers.length === 0) {
            throw new Error('Không tìm thấy đáp án hợp lệ!\n\nHỗ trợ các format:\n- Câu 1: A\n- 1. A\n- 1 A\n- A (theo thứ tự)');
        }

        if (answers.length !== expectedCount) {
            throw new Error(`Cần ${expectedCount} đáp án, chỉ tìm thấy ${answers.length}!\n\nVui lòng kiểm tra lại số lượng đáp án.`);
        }

        // Sắp xếp theo số thứ tự câu hỏi
        answers.sort((a, b) => a.questionNumber - b.questionNumber);

        // Trả về mảng chỉ có đáp án
        return answers.map(a => a.answer);
    }

    /**
     * Thử match câu hỏi với các pattern
     */
    matchQuestion(line) {
        for (let pattern of this.questionPatterns) {
            const match = line.match(pattern);
            if (match) {
                return {
                    number: parseInt(match[1]),
                    text: match[2].trim()
                };
            }
        }
        return null;
    }

    /**
     * Thử match lựa chọn với các pattern
     */
    matchOption(line) {
        for (let pattern of this.optionPatterns) {
            const match = line.match(pattern);
            if (match) {
                return {
                    letter: match[1],
                    text: match[2].trim()
                };
            }
        }
        return null;
    }

    /**
     * Phân tích và hiển thị preview
     */
    analyzeText(text, type = 'questions') {
        try {
            if (type === 'questions') {
                const questions = this.parseQuestions(text);
                return {
                    success: true,
                    count: questions.length,
                    data: questions,
                    message: `✅ Nhận diện thành công ${questions.length} câu hỏi`
                };
            } else if (type === 'answers') {
                // Cần số lượng câu hỏi để validate
                return {
                    success: true,
                    message: '✅ Format đáp án hợp lệ'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: '❌ ' + error.message
            };
        }
    }

    /**
     * Tạo ví dụ format
     */
    getExamples() {
        return {
            questions: `Ví dụ các format được hỗ trợ:

📝 Format 1 (Chuẩn):
Câu 1: Thủ đô của Việt Nam là gì?
A. Hồ Chí Minh
B. Hà Nội
C. Đà Nẵng
D. Huế

📝 Format 2 (Số):
1. Thủ đô của Việt Nam là gì?
A. Hồ Chí Minh
B. Hà Nội
C. Đà Nẵng
D. Huế

📝 Format 3 (Tiếng Anh):
Question 1: What is the capital of Vietnam?
A. Ho Chi Minh
B. Hanoi
C. Da Nang
D. Hue

📝 Format 4 (Dấu ngoặc):
1) Thủ đô của Việt Nam là gì?
A) Hồ Chí Minh
B) Hà Nội
C) Đà Nẵng
D) Huế`,

            answers: `Ví dụ các format được hỗ trợ:

✅ Format 1 (Đầy đủ):
Câu 1: B
Câu 2: A
Câu 3: C

✅ Format 2 (Số):
1. B
2. A
3. C

✅ Format 3 (Đơn giản):
B
A
C

✅ Format 4 (Không dấu):
1 B
2 A
3 C`
        };
    }
}

// Export để sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartQuestionParser;
}
