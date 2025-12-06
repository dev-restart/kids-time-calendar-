import { timeStore } from "$lib/stores/timeStore.svelte";

export type QuestionType = "TIME_MATCH" | "TIME_ADD" | "DATE_ADD";

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    targetMinutes?: number; // For time matching
    targetDayOffset?: number; // For date questions
    startMinutes?: number; // Snapshot of start
}

export class QuizStore {
    currentQuestion = $state<Question | null>(null);
    feedback = $state<"idle" | "correct" | "incorrect">("idle");
    selectedDay = $state<number | null>(null);

    generateQuestion() {
        this.feedback = "idle";
        this.selectedDay = null;
        const types: QuestionType[] = ["TIME_ADD", "DATE_ADD"];
        const type = types[Math.floor(Math.random() * types.length)];

        // Random start time (mostly day time)
        const startHour = Math.floor(Math.random() * 12) + 6;
        const startMin = Math.floor(Math.random() * 6) * 10;
        const startTotal = startHour * 60 + startMin;

        timeStore.setMinutes(startTotal);

        if (type === "TIME_ADD") {
            const addMin = (Math.floor(Math.random() * 6) + 1) * 10; // 10, 20... 60
            const addHour = Math.floor(Math.random() * 2); // 0 or 1 hour
            const totalAdd = addMin + addHour * 60;

            this.currentQuestion = {
                id: crypto.randomUUID(),
                type,
                text: `지금은 ${startHour}시 ${startMin}분이에요. ${addHour > 0 ? addHour + '시간 ' : ''}${addMin}분 뒤는 몇 시일까요?`,
                targetMinutes: startTotal + totalAdd,
                startMinutes: startTotal
            };
        } else if (type === "DATE_ADD") {
            const addDays = Math.floor(Math.random() * 3) + 1; // 1 to 3 days
            const addHours = addDays * 24;
            // Use Real Date for consistency with Calendar
            const today = new Date();
            const currentRealDay = today.getDate();

            this.currentQuestion = {
                id: crypto.randomUUID(),
                type,
                text: `오늘은 ${currentRealDay}일이에요. ${addDays}일 뒤는 며칠일까요? (${addHours}시간 뒤)`,
                targetDayOffset: addDays,
                startMinutes: startTotal
            };
        }
    }

    checkAnswer() {
        if (!this.currentQuestion) return;

        if (this.currentQuestion.type === "TIME_ADD") {
            const currentMod = timeStore.totalMinutes % 1440;
            const targetMod = this.currentQuestion.targetMinutes! % 1440;

            if (Math.abs(currentMod - targetMod) <= 5) {
                this.feedback = "correct";
            } else {
                this.feedback = "incorrect";
            }
        } else if (this.currentQuestion.type === "DATE_ADD") {
            // Logic Fix: Validate based on Calendar Date (absolute) OR Days (relative)

            // 1. Get Today's Date
            const today = new Date();

            // 2. Calculate Target Date
            // Target Day Offset is relative to "Now" (which we assume is Day 1 / Today)
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + this.currentQuestion.targetDayOffset!);
            const targetDateNum = targetDate.getDate();

            // 3. Relative Target Day (e.g. Day 1 + 2 = Day 3)
            const targetRelativeDay = 1 + this.currentQuestion.targetDayOffset!;

            if (this.selectedDay === targetDateNum || timeStore.dayCounter === targetRelativeDay) {
                this.feedback = "correct";
            } else {
                this.feedback = "incorrect";
            }
        }
    }

    selectDay(day: number) {
        this.selectedDay = day;
    }
}

export const quizStore = new QuizStore();
