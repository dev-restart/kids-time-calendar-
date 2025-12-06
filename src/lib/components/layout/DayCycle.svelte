<script lang="ts">
    import { timeStore } from "$lib/stores/timeStore.svelte";

    let { children } = $props();

    // Computed background style based on hours
    let hour = $derived(timeStore.hours + timeStore.minutes / 60);

    // Define key colors
    // 0: Night, 6: Sunrise, 12: Noon, 18: Sunset, 24: Night

    let bgClass = $derived.by(() => {
        if (hour < 5)
            return "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900"; // Deep Night
        if (hour < 7)
            return "bg-gradient-to-b from-indigo-900 via-orange-300 to-yellow-100"; // Sunrise
        if (hour < 11) return "bg-gradient-to-b from-sky-400 to-blue-200"; // Morning
        if (hour < 16) return "bg-gradient-to-b from-sky-300 to-blue-100"; // Noon/Afternoon
        if (hour < 19)
            return "bg-gradient-to-b from-indigo-400 via-orange-400 to-pink-300"; // Sunset
        if (hour < 21) return "bg-gradient-to-b from-indigo-800 to-purple-900"; // Evening
        return "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900"; // Night
    });

    // Opacity overlay for stars? (Optional polish)
</script>

<div
    class="fixed inset-0 w-full h-full transition-colors duration-1000 ease-in-out -z-50 {bgClass}"
>
    <!-- Optional: Sun/Moon position -->
</div>

<div class="relative w-full min-h-screen">
    {@render children()}
</div>
