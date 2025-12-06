
export class TimeStore {
    totalMinutes = $state(720); // Start at 12:00 PM (720 minutes)

    // Derived values for easy consumption
    hours = $derived(Math.floor(this.totalMinutes / 60) % 24);
    minutes = $derived(Math.round(this.totalMinutes) % 60); // Round for display safety
    totalHours = $derived(Math.floor(this.totalMinutes / 60));
    dayCounter = $derived(Math.floor(this.totalMinutes / 1440) + 1); // Start Day 1

    // Format HH:MM
    formattedTime = $derived(
        `${String(this.hours).padStart(2, "0")}:${String(this.minutes).padStart(2, "0")}`
    );

    // Day/Night Logic (Simple 6am-6pm window for "Day")
    isDay = $derived(this.hours >= 6 && this.hours < 18);

    // Dynamic Time Terms
    // 새벽 (03-06), 아침 (06-11), 정오 (12:00), 오후 (12-17), 저녁 (17-21), 밤 (21-03)
    timeTerm = $derived.by(() => {
        const h = this.hours;
        if (h >= 3 && h < 6) return "새벽";
        if (h >= 6 && h < 11) return "아침";
        if (h === 12 && this.minutes === 0) return "정오"; // Exact noon
        if (h >= 11 && h < 17) return "점심/오후"; // Broadly Afternoon
        if (h >= 17 && h < 21) return "저녁";
        if (h >= 21 || h < 3) return "밤";
        if (h === 0 && this.minutes === 0) return "자정";
        return "밤"; // Fallback
    });

    // Background Gradient Progress (0 to 1 based on 24h cycle)
    dayProgress = $derived((this.totalMinutes % 1440) / 1440);

    constructor(initialMinutes = 720) {
        this.totalMinutes = initialMinutes;
    }

    // Actions
    setMinutes(m: number) {
        if (m < 0) m = 0;
        // If we are setting minutes directly (e.g. from TimeBar drag within a single day context),
        // we likely want to preserve the current "day".
        // But TimeBar currently calculates based on ratio of *one day* (0-1440).
        // We need to support dragging across days or keep it simple.
        // For MVP, if TimeBar represents 0-24h of *current day*, we should add (this.dayCounter-1)*1440.

        this.totalMinutes = m;
    }

    // Enhanced setMinutes for TimeBar (keeps current day)
    setDayMinutes(dayMinutes: number) {
        const currentDayStart = (this.dayCounter - 1) * 1440;
        this.totalMinutes = currentDayStart + dayMinutes;
    }

    addMinutes(amount: number) {
        this.totalMinutes += amount;
        if (this.totalMinutes < 0) this.totalMinutes = 0;
    }

    setTime(h: number, m: number) {
        const currentDayStart = this.dayCounter * 1440;
        const newMinutes = currentDayStart + h * 60 + m;
        this.setMinutes(newMinutes);
    }

    reset() {
        this.totalMinutes = 720;
    }
}

// Ensure singleton pattern if needed, or export class to be instantiated in usage
export const timeStore = new TimeStore();
