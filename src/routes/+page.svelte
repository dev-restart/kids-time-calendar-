<script lang="ts">
    import ClockFace from "$lib/components/clock/ClockFace.svelte";
    import TimeBar from "$lib/components/clock/TimeBar.svelte";
    import DayCycle from "$lib/components/layout/DayCycle.svelte";
    import { timeStore } from "$lib/stores/timeStore.svelte";
    import TimeAdder from "$lib/components/math/TimeAdder.svelte";
    import FullCalendar from "$lib/components/widgets/FullCalendar.svelte";
    import QuizWidget from "$lib/components/widgets/QuizWidget.svelte";

    let is24Hour = $state(false);

    let displayTime = $derived.by(() => {
        if (is24Hour) {
            return timeStore.formattedTime;
        } else {
            const h = timeStore.hours % 12 || 12;
            const m = String(timeStore.minutes).padStart(2, "0");
            const ampm = timeStore.hours < 12 ? "AM" : "PM";
            return `${h}:${m} ${ampm}`;
        }
    });

    let isTimeBarVisible = $state(true);

    function toggleFormat() {
        is24Hour = !is24Hour;
    }
</script>

<DayCycle>
    <div class="flex flex-col min-h-screen pb-24 overflow-hidden relative">
        <!-- Added pb-24 for space -->
        <!-- Header / Title -->
        <header class="w-full flex justify-between items-center px-8 py-6 z-20">
            <div class="flex flex-col">
                <h1
                    class="text-3xl md:text-5xl font-jua text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] tracking-wide whitespace-nowrap"
                >
                    시간 탐험대 🚀
                </h1>
                <p
                    class="text-white/90 font-dohyeon text-xs md:text-lg mt-1 tracking-wider opacity-90 pl-1 whitespace-nowrap"
                >
                    재미있는 시간 여행을 떠나요!
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div
                    class="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white font-dohyeon text-xl shadow-lg"
                >
                    {displayTime}
                </div>
                <!-- Format Toggle -->
                <button
                    onclick={toggleFormat}
                    class="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full border border-white/30 text-white shadow-lg transition-all active:scale-95"
                    title="Toggle 12h/24h"
                >
                    <span class="text-sm font-bold"
                        >{is24Hour ? "24H" : "12H"}</span
                    >
                </button>
            </div>
        </header>

        <!-- Main Content Grid -->
        <main
            class="flex-1 w-full max-w-[1600px] mx-auto z-10 px-4 lg:px-8 pb-32"
        >
            <!-- Mobile View: Stacked (TimeAdder -> Clock -> Calendar -> Quiz) -->
            <!-- Desktop View: Grid (Calendar | Clock | Quiz/Adder) -->
            <div
                class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full"
            >
                <!-- Mobile Only: Time Adder Horizontal (Top) -->
                <div class="lg:hidden w-full flex justify-center mb-6 order-1">
                    <TimeAdder />
                </div>

                <!-- Left: Calendar (3 cols) -->
                <div
                    class="lg:col-span-3 flex justify-center order-3 lg:order-1 mt-8 lg:mt-0 w-full"
                >
                    <FullCalendar />
                </div>

                <!-- Center: Clock (6 cols) -->
                <div
                    class="lg:col-span-6 flex flex-col justify-center items-center gap-6 order-2 lg:order-2"
                >
                    <div
                        class="bg-white/30 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 flex flex-col items-center gap-4 relative z-10 ring-1 ring-white/50"
                    >
                        <div
                            class="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
                        ></div>
                        <ClockFace size={350} />
                        <div
                            class="text-center text-slate-700 text-sm font-dohyeon mt-4 bg-white/60 px-6 py-2 rounded-full shadow-sm backdrop-blur-sm border border-white/50"
                        >
                            시간 블록을 시계 위로 드래그해보세요! 👆
                        </div>
                    </div>

                    <!-- Term Display -->
                    <div class="text-center">
                        <p
                            class="text-white text-3xl font-dohyeon drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] opacity-100 flex items-center justify-center gap-3"
                        >
                            <span
                                class="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm"
                                >{timeStore.timeTerm}</span
                            >
                            <span
                                >{timeStore.isDay
                                    ? "🌞 해가 떠있는 낮이에요!"
                                    : "🌙 달이 뜬 밤이에요!"}</span
                            >
                        </p>
                    </div>
                </div>

                <!-- Right: Tools (3 cols) -->
                <div
                    class="lg:col-span-3 flex flex-col gap-6 justify-center order-4 lg:order-3 mt-8 lg:mt-0 w-full"
                >
                    <!-- Quiz Widget -->
                    <div class="w-full flex justify-center">
                        <QuizWidget />
                    </div>

                    <div
                        class="w-full h-px bg-white/20 my-2 hidden lg:block"
                    ></div>

                    <!-- Desktop Only: Time Adder -->
                    <div
                        class="w-full justify-center scale-90 origin-top hidden lg:flex"
                    >
                        <TimeAdder />
                    </div>
                </div>
            </div>
        </main>

        <!-- Bottom Time Bar Area -->
        <div
            class="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none"
        >
            <!-- Bar Container -->
            <div
                class="w-full bg-white/80 backdrop-blur-xl border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 pointer-events-auto relative {isTimeBarVisible
                    ? 'translate-y-0'
                    : 'translate-y-full'}"
            >
                <!-- Toggle Button (Absolute attached to top of bar) -->
                <button
                    onclick={() => (isTimeBarVisible = !isTimeBarVisible)}
                    class="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-600 rounded-full p-2 shadow-lg border border-slate-200 hover:bg-slate-50 transition-transform active:scale-95 z-50 flex items-center justify-center"
                    title={isTimeBarVisible ? "Hide Time Bar" : "Show Time Bar"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 transition-transform {isTimeBarVisible
                            ? 'rotate-180'
                            : ''}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7 7"
                        />
                    </svg>
                </button>

                <div class="max-w-7xl mx-auto py-4 px-6">
                    <!-- Reduced padding -->
                    <TimeBar />
                </div>
            </div>
        </div>
    </div>
</DayCycle>
