<script lang="ts">
    import { timeStore } from "$lib/stores/timeStore.svelte";

    // We can use a fake start date (e.g. today)
    // Or just show "Day N"

    let startDate = new Date();

    let currentDateDisplay = $derived.by(() => {
        const d = new Date(startDate);
        // Add days based on dayCounter (1-based)
        d.setDate(d.getDate() + (timeStore.dayCounter - 1));

        return {
            month: d.toLocaleString("default", { month: "short" }),
            date: d.getDate(),
            day: d.toLocaleString("default", { weekday: "short" }),
            count: timeStore.dayCounter,
        };
    });
</script>

<div class="fixed top-4 left-4 z-40">
    <div
        class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center w-24 border-2 border-slate-200"
    >
        <div
            class="bg-red-500 w-full py-1 text-center text-white font-bold text-xs uppercase tracking-wider"
        >
            {currentDateDisplay.month}
        </div>
        <div
            class="p-2 flex flex-col items-center justify-center bg-white h-16 w-full relative overflow-hidden"
        >
            {#key currentDateDisplay.date}
                <div
                    class="flex flex-col items-center absolute inset-0 justify-center animate-in slide-in-from-top duration-300 fill-mode-both"
                >
                    <span class="text-4xl font-jua text-slate-800 leading-none">
                        {currentDateDisplay.date}
                    </span>
                    <span
                        class="text-xs font-bold text-slate-400 mt-1 uppercase"
                    >
                        {currentDateDisplay.day}
                    </span>
                </div>
            {/key}
        </div>
        <div
            class="bg-slate-100 w-full py-1 text-center text-slate-500 text-[10px] font-bold border-t border-slate-200"
        >
            Day {currentDateDisplay.count}
        </div>
    </div>
</div>
