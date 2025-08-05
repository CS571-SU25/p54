import ExercisesClassifyt from "../content/ExercisesClassifyt";

export default function WorkoutAlgorithm(userData) {
    const exercises = ExercisesClassifyt();
    const strengthRatio = userData.Strength;
    const isAthlete = userData.Athlete === 1;
    const totalDays = userData.Frequency;
    const cardioPercent = userData.Cardio;
    const strengthPercent = userData.Strength;
    const focus = userData.Focus.toLowerCase();

    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());
    const splitCycle = ["push", "pull", "legs"];

    const pickReps = reps =>
        strengthRatio >= 75 ? reps[0] :
        strengthRatio >= 50 ? reps[1] || reps[0] :
        reps[reps.length - 1];

    const pickSets = sets =>
        strengthRatio >= 75 ? sets[sets.length - 1] :
        strengthRatio >= 50 ? sets[1] || sets[0] :
        sets[0];

    const pickName = name => name[Math.floor(Math.random() * name.length)];

    const enrichExercise = ex => ({
        ...ex,
        name: pickName(ex.name),
        sets: pickSets(ex.sets),
        reps: pickReps(ex.reps)
    });

    const muscularity = userData.Muscularity;
    function getCardioVolume(m) {
        if (m >= 8) return { core: 1, main: 1, supplemental: 1 };
        if (m >= 5) return { core: 1, main: 0, supplemental: 1 };
        return { core: 1, main: 0, supplemental: 0 };
    }

    const filterExercises = (role, routine, targetIncludes = []) => {
        return shuffle(exercises.filter(ex => {
            const target = ex.tags.target.toLowerCase();
            return (
                ex.tags.role === role &&
                ex.tags.routine === routine &&
                (isAthlete || !ex.tags.athlete) &&
                (targetIncludes.length === 0 || targetIncludes.some(t => target.includes(t)))
            );
        }).map(enrichExercise));
    };

    const pickWithTargetMinimums = (list, total, mustIncludeTargets = []) => {
        const selected = [];
        const usedTargets = new Set();

        for (const target of mustIncludeTargets) {
            const match = list.find(ex => ex.tags?.target?.toLowerCase().includes(target));
            if (match) {
                selected.push(match);
                usedTargets.add(match.tags.target.toLowerCase());
            }
        }

        const remainder = list.filter(ex => !usedTargets.has(ex.tags?.target?.toLowerCase()));
        selected.push(...remainder.slice(0, total - selected.length));

        return selected.slice(0, total);
    };

    // see if user qualifies for cardio-only days
    const cardioHeavy =
        (focus === "weight loss" && cardioPercent > strengthPercent) ||
        cardioPercent > 3 * strengthPercent;

    const workouts = [];

    for (let i = 0; i < totalDays; i++) {
        let dayPlan = { day: i + 1 };

        if (cardioHeavy) {
            const { core, main, supplemental } = getCardioVolume(muscularity);
            dayPlan.type = "cardio";
            dayPlan.core = filterExercises("core", "cardio").slice(0, core);
            dayPlan.main = filterExercises("main", "cardio").slice(0, main);
            dayPlan.supplemental = filterExercises("supplemental", "cardio").slice(0, supplemental);
        } else {
            const routineType = splitCycle[i % splitCycle.length];
            dayPlan.type = routineType;

            if (routineType === "push") {
                dayPlan.core = [
                    ...filterExercises("core", "push", ["chest"]).slice(0, 1),
                    ...filterExercises("core", "push", ["arms"]).slice(0, 1)
                ];
                dayPlan.main = pickWithTargetMinimums(
                    filterExercises("main", "push"),
                    3,
                    ["chest", "shoulders"]
                );
                dayPlan.supplemental = pickWithTargetMinimums(
                    filterExercises("supplemental", "push"),
                    3,
                    ["arms"]
                );
            } else if (routineType === "pull") {
                dayPlan.core = [
                    ...filterExercises("core", "pull", ["back", "lats"]).slice(0, 1),
                    ...filterExercises("core", "pull", ["arms"]).slice(0, 1)
                ];
                dayPlan.main = pickWithTargetMinimums(
                    filterExercises("main", "pull"),
                    2,
                    ["lats"]
                );
                dayPlan.supplemental = pickWithTargetMinimums(
                    filterExercises("supplemental", "pull"),
                    4,
                    ["arms"]
                );
            } else if (routineType === "legs") {
                dayPlan.core = filterExercises("core", "legs", ["legs"]).slice(0, 1);
                dayPlan.main = filterExercises("main", "legs").slice(0, 4);
                dayPlan.supplemental = filterExercises("supplemental", "legs", ["calves"]).slice(0, 1);
            }

            // Add cardio to normal days if cardio is present at all
            if (cardioPercent > 0.2) {
                const numCardio = cardioPercent > 0.5 ? 2 : 1;
                const cardioSupp = filterExercises("supplemental", "cardio").slice(0, numCardio);
                if (cardioSupp.length) {
                    dayPlan.cardio = cardioSupp;
                }
            }
        }
        dayPlan.Checked = false;
        workouts.push(dayPlan);
    }

    return workouts;
}