<script lang="ts">
    import TimeBlock from "./TimeBlock.svelte";
    // Subtraction Mode
    let mode = $state<"add" | "subtract">("add");

    function toggleMode() {
        mode = mode === "add" ? "subtract" : "add";
    }
</script>

<div
    class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-white/50 w-full max-w-sm"
>
    <div class="flex items-center justify-between mb-2">
        <span class="font-jua text-lg text-slate-700">시간 더하기</span>

        <!-- Toggle Add/Subtract -->
        <button
            onclick={toggleMode}
            class="px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm
            {mode === 'add'
                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                : 'bg-red-100 text-red-700 ring-1 ring-red-300'}"
        >
            {mode === "add" ? "더하기 모드" : "빼기 모드"}
        </button>
    </div>

    <div class="flex flex-wrap gap-2 justify-center">
        <!-- Different Time Blocks -->
        <!-- Responsive sizing logic is handled in TimeBlock, but container needs to allow wrapping or fit -->
        <TimeBlock type="hour" value={mode === "add" ? 60 : -60} />
        <TimeBlock type="10min" value={mode === "add" ? 10 : -10} />
        <TimeBlock type="5min" value={mode === "add" ? 5 : -5} />
        <TimeBlock type="1min" value={mode === "add" ? 1 : -1} />
    </div>
</div>
