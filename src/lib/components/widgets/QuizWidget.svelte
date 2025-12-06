<script lang="ts">
    import { quizStore } from "$lib/stores/quizStore.svelte";

    function handleNext() {
        quizStore.generateQuestion();
    }

    function handleCheck() {
        quizStore.checkAnswer();
    }
</script>

<div
    class="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-slate-200 w-full max-w-sm"
>
    <h3
        class="text-slate-600 font-bold mb-2 font-jua text-center border-b pb-2"
    >
        퀴즈 놀이 🎲
    </h3>

    {#if !quizStore.currentQuestion}
        <div class="text-center py-4">
            <p class="text-slate-500 mb-4 font-dohyeon">
                시간 여행 문제를 풀어볼까요?
            </p>
            <button
                onclick={handleNext}
                class="bg-primary text-white font-bold py-2 px-6 rounded-full shadow-md hover:scale-105 transition-transform"
            >
                문제 시작!
            </button>
        </div>
    {:else}
        <div class="flex flex-col gap-4">
            <div class="bg-slate-50 p-3 rounded-lg text-center">
                <p class="text-lg font-jua text-slate-800 break-keep">
                    {quizStore.currentQuestion.text}
                </p>
            </div>

            {#if quizStore.feedback === "idle"}
                <button
                    onclick={handleCheck}
                    class="bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-600 transition-colors"
                >
                    정답 확인
                </button>
            {:else if quizStore.feedback === "correct"}
                <div
                    class="bg-green-100 text-green-700 p-3 rounded-xl text-center font-bold animate-in bounce-in"
                >
                    🎉 정답입니다! 참 잘했어요!
                </div>
                <button
                    onclick={handleNext}
                    class="bg-slate-200 text-slate-700 font-bold py-2 rounded-xl hover:bg-slate-300"
                >
                    다음 문제
                </button>
            {:else}
                <div
                    class="bg-red-100 text-red-700 p-3 rounded-xl text-center font-bold animate-in shake"
                >
                    🤔 다시 한번 시계를 확인해보세요!
                </div>
                <button
                    onclick={handleCheck}
                    class="bg-indigo-500 text-white font-bold py-2 rounded-xl hover:bg-indigo-600"
                >
                    다시 검사하기
                </button>
            {/if}
        </div>
    {/if}
</div>
