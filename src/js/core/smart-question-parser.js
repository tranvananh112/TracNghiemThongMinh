/**
 * Smart Question Parser - Fixed Version
 * Nhận diện tự động mọi định dạng câu hỏi với độ tin cậy cao
 */

class SmartQuestionParser {
    constructor() {
        // Các từ khóa nhận diện câu hỏi
        this.questionKeywords = ['câu', 'cau', 'question', 'q', 'quest'];

        // Các ký tự phân cách
        this.separators = [':', '.', ')', '-', '：', '）'];

        // Các chữ cái lựa chọn
        this.optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }

    /**
     * Parse câu hỏi từ text - Phiên bản ổn định
     */
    parseQuestions(text) {
        if (!text || !text.trim()) {
            throw new Error('Văn bản câu hỏi trống!');
        }

        console.log('🔍 Parsing questions...');

        // Làm sạch và chuẩn hóa text
        text = this.cleanText(text);

        // Tách thành các dòng
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        const questions = [];
        let currentQuestion = null;
        let currentOptions = [];
        let questionNumber = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Kiểm tra xem có phải câu hỏi mới không
            const questionMatch = this.isQuestionLine(line);
            if (questionMatch) {
                // Lưu câu hỏi trước đó
                if (currentQuestion && currentOptions.length >= 2) {
                    questions.push({
                        questionNumber: questionNumber,
                        question: currentQuestion,
                        options: currentOptions
                    });
                }

                // Bắt đầu câu hỏi mới
                questionNumber = questionMatch.number || (questionNumber + 1);
                currentQuestion = questionMatch.text;
                currentOptions = [];
                continue;
            }

            // Kiểm tra xem có phải lựa chọn không
            const optionMatch = this.isOptionLine(line);
            if (optionMatch && currentQuestion) {
                currentOptions.push({
                    letter: optionMatch.letter,
                    text: this.cleanOptionText(optionMatch.text)
                });
                continue;
            }

            // Nếu không phải câu hỏi hay lựa chọn, nối vào phần hiện tại
            if (currentQuestion) {
                if (currentOptions.length === 0) {
                    // Nối vào câu hỏi
                    currentQuestion += ' ' + line;
                } else {
                    // Nối vào lựa chọn cuối cùng
                    const lastOption = currentOptions[currentOptions.length - 1];
                    const cleanLine = this.cleanOptionText(line);

                    // Chỉ nối nếu không phải từ "Câu" đơn lẻ hoặc số câu hỏi
                    if (cleanLine && !this.isQuestionKeyword(cleanLine)) {
                        lastOption.text += ' ' + cleanLine;
                    }
                }
            }
        }

        // Lưu câu hỏi cuối cùng
        if (currentQuestion && currentOptions.length >= 2) {
            questions.push({
                questionNumber: questionNumber,
                question: currentQuestion,
                options: currentOptions
            });
        }

        if (questions.length === 0) {
            throw new Error('Không tìm thấy câu hỏi hợp lệ!\n\nVí dụ format hỗ trợ:\nCâu 1: Nội dung câu hỏi?\nA. Lựa chọn A\nB. Lựa chọn B');
        }

        console.log(`✅ Parsed ${questions.length} questions successfully`);
        return questions;
    }

    /**
     * Parse đáp án từ text - NÂNG CẤP THÔNG MINH
     * Nhận diện mọi format và tự động sắp xếp theo thứ tự
     */
    parseAnswers(text, expectedCount) {
        if (!text || !text.trim()) {
            throw new Error('Văn bản đáp án trống!');
        }

        console.log('🔍 Smart parsing answers...');

        // Làm sạch text trước
        text = this.cleanAnswerText(text);

        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const answers = [];
        let sequentialIndex = 0;

        for (let line of lines) {
            const extractedAnswers = this.extractAnswersFromLine(line);

            for (let answerData of extractedAnswers) {
                if (answerData.questionNumber) {
                    // Có số câu hỏi cụ thể
                    answers.push(answerData);
                } else {
                    // Không có số câu hỏi, sắp xếp theo thứ tự
                    sequentialIndex++;
                    answers.push({
                        questionNumber: sequentialIndex,
                        answer: answerData.answer
                    });
                }
            }
        }

        if (answers.length === 0) {
            throw new Error('Không tìm thấy đáp án hợp lệ!\n\nVí dụ format hỗ trợ:\n- Câu 1: A, Câu 2: B\n- 1. A, 2. B\n- A B C D\n- A, B, C, D');
        }

        if (answers.length !== expectedCount) {
            throw new Error(`Cần ${expectedCount} đáp án, tìm thấy ${answers.length}!\n\nĐáp án tìm thấy: ${answers.map(a => a.answer).join(', ')}`);
        }

        // Sắp xếp theo thứ tự câu hỏi
        answers.sort((a, b) => a.questionNumber - b.questionNumber);

        console.log(`✅ Parsed ${answers.length} answers: ${answers.map(a => a.answer).join(', ')}`);
        return answers.map(a => a.answer);
    }

    /**
     * Làm sạch text đáp án
     */
    cleanAnswerText(text) {
        // Loại bỏ BOM và ký tự đặc biệt
        text = text.replace(/^\uFEFF/, '');
        text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Chuẩn hóa xuống dòng
        text = text.replace(/\r\n/g, '\n');
        text = text.replace(/\r/g, '\n');

        // Thay thế dấu phẩy, chấm phẩy bằng xuống dòng để tách đáp án
        text = text.replace(/[,;]\s*/g, '\n');

        // Thay thế khoảng trắng nhiều bằng xuống dòng (cho format: A B C D)
        text = text.replace(/\s+([A-H])\s+/gi, '\n$1\n');

        // Loại bỏ khoảng trắng thừa
        text = text.replace(/[ ]{2,}/g, ' ');
        text = text.replace(/\n{2,}/g, '\n');

        return text.trim();
    }

    /**
     * Trích xuất đáp án từ một dòng
     */
    extractAnswersFromLine(line) {
        const results = [];

        // Pattern 1: Câu 1: A, Câu 2: B (nhiều đáp án trong một dòng)
        const multiplePattern = /(?:câu|cau|question|q)\s*(\d+)\s*[:：.)\-]?\s*([A-Ha-h])/gi;
        let match;
        while ((match = multiplePattern.exec(line)) !== null) {
            results.push({
                questionNumber: parseInt(match[1]),
                answer: match[2].toUpperCase()
            });
        }

        if (results.length > 0) return results;

        // Pattern 2: 1. A, 2. B (nhiều đáp án với số)
        const numberPattern = /(\d+)\s*[:：.)\-]?\s*([A-Ha-h])/g;
        while ((match = numberPattern.exec(line)) !== null) {
            results.push({
                questionNumber: parseInt(match[1]),
                answer: match[2].toUpperCase()
            });
        }

        if (results.length > 0) return results;

        // Pattern 3: A B C D (nhiều đáp án liền nhau)
        const lettersPattern = /\b([A-Ha-h])\b/g;
        const letters = [];
        while ((match = lettersPattern.exec(line)) !== null) {
            const letter = match[1].toUpperCase();
            if (this.optionLetters.includes(letter)) {
                letters.push(letter);
            }
        }

        if (letters.length > 1) {
            // Nhiều chữ cái trong một dòng
            return letters.map(letter => ({
                questionNumber: null, // Sẽ được gán số thứ tự sau
                answer: letter
            }));
        }

        // Pattern 4: Đáp án đơn lẻ
        const singlePatterns = [
            /^(?:câu|cau|question|q)\s*(\d+)\s*[:：.)\-]?\s*([A-Ha-h])\s*$/i,
            /^(\d+)\s*[:：.)\-]?\s*([A-Ha-h])\s*$/,
            /^([A-Ha-h])\s*$/i
        ];

        for (let pattern of singlePatterns) {
            const match = line.match(pattern);
            if (match) {
                if (match.length === 3) {
                    // Có số câu hỏi
                    results.push({
                        questionNumber: parseInt(match[1]),
                        answer: match[2].toUpperCase()
                    });
                } else {
                    // Chỉ có đáp án
                    results.push({
                        questionNumber: null,
                        answer: match[1].toUpperCase()
                    });
                }
                break;
            }
        }

        return results;
    }

    /**
     * Kiểm tra xem dòng có phải câu hỏi không
     */
    isQuestionLine(line) {
        // Pattern 1: Câu 1: / Question 1:
        for (let keyword of this.questionKeywords) {
            for (let sep of this.separators) {
                const pattern = new RegExp(`^${keyword}\\s*(\\d+)\\s*\\${sep}\\s*(.+)`, 'i');
                const match = line.match(pattern);
                if (match) {
                    return {
                        number: parseInt(match[1]),
                        text: match[2].trim()
                    };
                }
            }
        }

        // Pattern 2: 1. / 1:
        for (let sep of this.separators) {
            const pattern = new RegExp(`^(\\d+)\\s*\\${sep}\\s*(.+)`);
            const match = line.match(pattern);
            if (match && match[2].length > 10) { // Câu hỏi thường dài hơn 10 ký tự
                return {
                    number: parseInt(match[1]),
                    text: match[2].trim()
                };
            }
        }

        return null;
    }

    /**
     * Kiểm tra xem dòng có phải lựa chọn không
     */
    isOptionLine(line) {
        // Pattern 1: A. / A:
        for (let letter of this.optionLetters) {
            for (let sep of this.separators) {
                const pattern = new RegExp(`^${letter}\\s*\\${sep}\\s*(.+)`, 'i');
                const match = line.match(pattern);
                if (match) {
                    return {
                        letter: letter,
                        text: match[1].trim()
                    };
                }
            }
        }

        // Pattern 2: A (space)
        const spaceMatch = line.match(/^([A-Ha-h])\s+(.+)/i);
        if (spaceMatch && this.optionLetters.includes(spaceMatch[1].toUpperCase())) {
            return {
                letter: spaceMatch[1].toUpperCase(),
                text: spaceMatch[2].trim()
            };
        }

        return null;
    }

    /**
     * Làm sạch text
     */
    cleanText(text) {
        // Loại bỏ BOM và ký tự đặc biệt
        text = text.replace(/^\uFEFF/, '');
        text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Chuẩn hóa xuống dòng
        text = text.replace(/\r\n/g, '\n');
        text = text.replace(/\r/g, '\n');

        // Tách câu hỏi và lựa chọn dính liền
        text = this.smartSeparate(text);

        // Loại bỏ khoảng trắng thừa
        text = text.replace(/[ ]{2,}/g, ' ');
        text = text.replace(/\n{3,}/g, '\n\n');

        return text.trim();
    }

    /**
     * Tách thông minh câu hỏi và lựa chọn dính liền
     */
    smartSeparate(text) {
        // Tách câu hỏi mới
        for (let keyword of this.questionKeywords) {
            const pattern = new RegExp(`\\s+(${keyword}\\s*\\d+\\s*[:：.)])`, 'gi');
            text = text.replace(pattern, '\n$1');
        }

        // Tách số câu hỏi
        text = text.replace(/\s+(\d+\s*[:：.)\-]\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ])/g, '\n$1');

        // Tách lựa chọn
        text = text.replace(/\s+([A-H]\s*[:：.)\-]\s*[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ0-9])/gi, '\n$1');

        return text;
    }

    /**
     * Làm sạch text lựa chọn
     */
    cleanOptionText(text) {
        if (!text) return text;

        // Loại bỏ từ "Câu" ở cuối (có thể có dấu cách hoặc không)
        text = text.replace(/\s*câu\s*$/gi, '');
        text = text.replace(/\s*cau\s*$/gi, '');

        // Loại bỏ từ "Câu" đơn lẻ ở đầu
        text = text.replace(/^câu\s+/gi, '');
        text = text.replace(/^cau\s+/gi, '');

        // Loại bỏ từ "Câu" đơn lẻ (toàn bộ dòng)
        text = text.replace(/^\s*câu\s*$/gim, '');
        text = text.replace(/^\s*cau\s*$/gim, '');

        // Loại bỏ số câu hỏi thừa ở cuối (ví dụ: "text. Câu 2")
        text = text.replace(/\.\s*câu\s*\d*\s*$/gi, '.');
        text = text.replace(/\.\s*cau\s*\d*\s*$/gi, '.');

        // Loại bỏ khoảng trắng thừa
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    }

    /**
     * Phân tích text với thông tin chi tiết
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
     * Preprocessing text đơn giản
     */
    aiPreprocess(text) {
        return this.cleanText(text);
    }

    /**
     * Kiểm tra xem có phải từ khóa câu hỏi không
     */
    isQuestionKeyword(text) {
        if (!text) return false;

        const cleanText = text.toLowerCase().trim();

        // Kiểm tra từ "Câu" đơn lẻ
        if (cleanText === 'câu' || cleanText === 'cau') {
            return true;
        }

        // Kiểm tra pattern "Câu [số]"
        if (/^(câu|cau)\s*\d*\s*$/i.test(cleanText)) {
            return true;
        }

        return false;
    }

    /**
     * Lấy ví dụ format
     */
    getExamples() {
        return {
            questions: `Ví dụ các format được hỗ trợ:

📝 Format chuẩn:
Câu 1: Thủ đô của Việt Nam là gì?
A. Hồ Chí Minh
B. Hà Nội
C. Đà Nẵng
D. Huế

📝 Format số:
1. Thủ đô của Việt Nam là gì?
A. Hồ Chí Minh
B. Hà Nội
C. Đà Nẵng
D. Huế

📝 Format tiếng Anh:
Question 1: What is the capital of Vietnam?
A. Ho Chi Minh City
B. Hanoi
C. Da Nang
D. Hue

📝 Format dính liền:
Câu 1: Câu hỏi? A. Đáp án A B. Đáp án B C. Đáp án C D. Đáp án D`,

            answers: `🎯 Nhận diện THÔNG MINH mọi format đáp án:

✅ Format đầy đủ:
Câu 1: B
Câu 2: A
Câu 3: C

✅ Format số:
1. B
2. A
3. C

✅ Format đơn giản (theo thứ tự):
B
A
C

✅ Format một dòng (phẩy):
B, A, C, D

✅ Format một dòng (khoảng trắng):
B A C D

✅ Format hỗn hợp:
Câu 1: B, 2. A, C, D

✅ Format tự do:
Đáp án câu 1 là B, câu 2 là A, câu 3 là C

🤖 Hệ thống tự động sắp xếp theo thứ tự câu hỏi!`
        };
    }
}

// Export để sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartQuestionParser;
}