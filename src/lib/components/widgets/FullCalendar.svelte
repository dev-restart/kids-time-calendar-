<script lang="ts">
    import { timeStore } from "$lib/stores/timeStore.svelte";
    import { quizStore } from "$lib/stores/quizStore.svelte";

    // Start with a base date (current real date)
    let displayDate = $state(new Date());

    let daysInMonth = $derived.by(() => {
        const d = new Date(displayDate);
        d.setDate(1); // Go to first day
        const month = d.getMonth();
        const year = d.getFullYear();

        const days = [];
        const firstDay = d.getDay(); // 0(Sun) - 6(Sat)

        // Fill prev month padding
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: "", type: "padding" });
        }

        // Fill current month
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            days.push({ day: i, type: "day" });
        }

        return days;
    });

    let monthName = $derived(
        displayDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
        }),
    );

    // Calculate Simulation Date based on dayCounter
    let simulationDate = $derived.by(() => {
        const d = new Date(); // Real Today
        d.setDate(d.getDate() + (timeStore.dayCounter - 1));
        return d;
    });

    // Check if a day on the calendar matches Simulation Date
    function isSimulationDate(dVal: number | string) {
        if (!dVal || typeof dVal !== "number") return false;
        // Check year/month match
        return (
            displayDate.getFullYear() === simulationDate.getFullYear() &&
            displayDate.getMonth() === simulationDate.getMonth() &&
            dVal === simulationDate.getDate()
        );
    }

    function handleDayClick(day: number) {
        quizStore.selectDay(day);
    }

    function prevMonth() {
        const d = new Date(displayDate);
        d.setMonth(d.getMonth() - 1);
        displayDate = d;
    }

    function nextMonth() {
        const d = new Date(displayDate);
        d.setMonth(d.getMonth() + 1);
        displayDate = d;
    }
</script>

<div
    class="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border-4 border-white/50 w-full max-w-sm"
>
    <div class="flex items-center justify-between mb-4">
        <button
            onclick={prevMonth}
            aria-label="Previous Month"
            class="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-primary transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                /></svg
            >
        </button>
        <div class="text-center">
            <h2 class="text-xl font-jua text-slate-700">{monthName}</h2>
            <!-- Optional: Show current simulation day context -->
            {#if simulationDate.getMonth() === displayDate.getMonth()}
                <p class="text-xs text-blue-600 font-bold">
                    Time travel: {simulationDate.getDate()}일
                </p>
            {/if}
        </div>
        <button
            onclick={nextMonth}
            aria-label="Next Month"
            class="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-primary transition-colors"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                /></svg
            >
        </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center mb-2">
        {#each ["일", "월", "화", "수", "목", "금", "토"] as day, i}
            <div
                class="text-xs font-bold {i === 0
                    ? 'text-red-500'
                    : 'text-slate-400'}"
            >
                {day}
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-7 gap-1">
        {#each daysInMonth as d}
            {#if d.type === "padding"}
                <div class="aspect-square"></div>
            {:else}
                <button
                    onclick={() => handleDayClick(d.day as number)}
                    class="
						aspect-square flex items-center justify-center rounded-lg font-jua text-lg transition-all relative
						{isSimulationDate(d.day)
                        ? 'bg-primary text-white shadow-lg ring-2 ring-white z-10'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        {quizStore.selectedDay === d.day
                        ? 'ring-4 ring-indigo-500 scale-110 z-20 bg-indigo-100 text-indigo-700'
                        : ''}
					"
                >
                    {d.day}

                    {#if quizStore.selectedDay === d.day}
                        <span class="absolute -top-1 -right-1 flex h-3 w-3">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
                            ></span>
                            <span
                                class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"
                            ></span>
                        </span>
                    {/if}
                </button>
            {/if}
        {/each}
    </div>

    <div class="mt-4 p-3 bg-blue-50 rounded-xl text-center">
        <span class="text-sm text-blue-800 font-bold">
            {timeStore.dayCounter}일째 시간 여행 중!
        </span>
    </div>
</div>
