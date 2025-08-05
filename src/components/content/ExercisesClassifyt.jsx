import { useEffect } from "react";

/**
 * This function is just the list of exercises as well as their breakdown/organization;
 * Instead of just hardcoding them into the api, I'm doing it this way so that the list
 * of exercises is mutable, as in i can add more or remove some exercises as i choose. 
 */
export default function ExercisesClassifyt() {
    // let's define some tags:
    // core: chest, back, legs, core - done by every workout plan
    // main: upper chest, lats, shoulders, quads, glutes, hammies
    // supplemental: biceps, triceps, forearms, calves, adductors

    const exercises = [
        // chest core
        {
            name: ["Barbell Bench Press", "Dumbell Bench Press"],
            sets: [3, 4, 5],
            reps: [5, 8, 10],
            rest: [60, ],
            tags: {
                role: "core",
                target: "chest",
                athlete: false,
                routine: 'push'
            }
        },
        // chest core athlete
        {
            name: ["Push-Up", "Incline Push-Up", "Decline Push-Up"],
            sets: [3, 4, 5],
            reps: [12, 15, 20],
            rest: [60, 90],
            tags: {
                role: "core",
                target: "chest",
                athlete: true,
                routine: 'push'
            }
        },
        // back core
        {
            name: ["Wide Grip Lat Pulldown", "MAG grip Lat Pulldown"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 150],
            tags: {
                role: "core",
                target: "back",
                athlete: false,
                routine: 'pull'
            }
        },
        // back core athlete
        {
            name: ["Pull-Ups", "Assisted (band) Pull-Ups"],
            sets: [3, 4, 5],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "core",
                target: "back",
                athlete: true,
                routine: 'pull'
            }
        },
        // legs core
        {
            name: ["Barbell Back Squat", "Barbell Deadlift"],
            sets: [3, 4, 5],
            reps: [5, 6, 8],
            rest: [120, 150],
            tags: {
                role: "core",
                target: "legs",
                athlete: false,
                routine: 'legs'
            }
        },
        // legs core athlete
        {
            name: ["Barbell One-Arm Suitcase Carry", "Dumbell One-Arm Suitcase Carry"],
            sets: [3, 4],
            reps: ["24 yards", "36 yards"],
            rest: [90, 150],
            tags: {
                role: "core",
                target: "legs",
                athlete: true,
                routine: 'legs'
            }
        },
        // push arms core
        {
            name: ["Cable Rope Tricep Pushdown"],
            sets: [3, 4],
            reps: [8, 10, 12],
            rest: [90, 120],
            tags: {
                role: "core",
                target: "arms",
                athlete: false,
                routine: "push"
            }
        },
        // push arms core athlete
        {
            name: ["Dips"],
            sets: [3, 4],
            reps: [8, 10, 12],
            rest: [60, 90],
            tags: {
                role: "core",
                target: "arms",
                athlete: true,
                routine: "push"
            }
        },
        // pull arms core 
        {
            name: ["Barbell Preacher Curl", "Dumbell Preacher Curl"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "core",
                target: "arms",
                athlete: false,
                routine: "pull"
            }
        },
        // pull arms core athlete
        {
            name: ["Close-Grip Chin-Ups", "Assisted (Band) Close-Grip Chin-Ups"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "core",
                target: "arms",
                athlete: true,
                routine: "pull"
            }
        },
        //
        // --- MAIN EXERCISES ---
        //

        // lats main
        {
            name: ["Close-Grip Lat Pulldown"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "lats",
                athlete: false,
                routine: "pull"
            }
        },
        // shoulder main
        {
            name: ["Barbell Shoulder Press", "Dumbell Shoulder Press", "Smith Machine Shoulder Press"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "shoulders",
                athlete: false,
                routine: "push"
            }
        },
        // glutes main
        {
            name: ["Barbell Hip Thrust", "Hip Thrust on Thrust Machine"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "glutes",
                athlete: false,
                routine: "legs"
            }
        },
        // quads main
        {
            name: ["Dumbell Bulgarian Split Squat"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [120],
            tags: {
                role: "main",
                target: "quads",
                athlete: false,
                routine: "legs"
            }
        },
        // glute main
        {
            name: ["Single-leg Glute Bridge Bodyweight 3-2-1s", "Weighted (on hip of elevated leg) Single-leg Glute Bridge"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "glutes",
                athlete: true,
                routine: "legs"
            }
        },
        // upper chest main
        {
            name: ["Barbell Incline Press", "Dumbell Incline Press"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "upper chest",
                athlete: false,
                routine: "push"
            }
        },
        // lower lats main
        {
            name: ["Cable Rows"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "lower lats",
                athlete: false,
                routine: "pull"
            }
        },
        // hammies main
        {
            name: ["Hamstring Curl"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "hamstrings",
                athlete: false,
                routine: "legs"
            }
        },
        // shoulder main athlete
        {
            name: ["One-Arm Landmine Press"],
            sets: [3, 4],
            reps: [6, 8, 10],
            rest: [90, 120],
            tags: {
                role: "main",
                target: "shoulders",
                athlete: true,
                routine: "push"
            }
        },

        // --- SUPPLEMENTAL EXERCISES ---
        {
            name: ["Dumbell Concentration Curl"],
            equipment: ["Dumbbell"],
            sets: [3],
            reps: [10, 12],
            rest: [60],
            tags: {
                role: "supplemental",
                target: "biceps",
                athlete: false, 
                routine: "pull"
            }
        },
        {
            name: ["Cable Overhead Triceps Extension"],
            sets: [3],
            reps: [10, 12],
            rest: [60],
            tags: {
                role: "supplemental",
                target: "triceps",
                athlete: false,
                routine: "push"
            }
        },
        {
            name: ["Calf Raise on Calf Machine"],
            sets: [4],
            reps: [15, 20],
            rest: [45],
            tags: {
                role: "supplemental",
                target: "calves",
                athlete: false,
                routine: "legs"
            }
        },
        {
            name: ["Side-Lying Hip Adduction with Band"],
            sets: [3],
            reps: [12, 15],
            rest: [45],
            tags: {
                role: "supplemental",
                target: "adductor",
                athlete: true,
                routine: "legs"
            }
        },
        {
            name: ["Plank Shoulder Taps"],
            sets: [3],
            reps: [20],
            rest: [60],
            tags: {
                role: "supplemental",
                target: "core",
                athlete: true,
                routine: 'push'
            }
        },
        // --- CARDIO EXERCISES ---
        {
            name: ["Treadmill Jog", "Outdoor Jog", "Track Jog"],
            sets: [1],
            reps: ["30 - 50 min"], // extended for core
            rest: [0],
            tags: {
                role: "core",
                target: "cardio",
                athlete: false,
                routine: "cardio"
            }
        },
        {
            name: ["Sprint Intervals"],
            sets: [6, 8],
            reps: ["30s sprint"],
            rest: [60],
            tags: {
                role: "core",
                target: "cardio",
                athlete: true,
                routine: "cardio"
            }
        },
        {
            name: ["Stationary Bike", "Spin Bike"],
            sets: [1],
            reps: ["10 - 20 min"], // shorter for supplemental
            rest: [0],
            tags: {
                role: "supplemental",
                target: "cardio",
                athlete: false,
                routine: "cardio"
            }
        },
        {
            name: ["Elliptical Trainer", "Incline Walking"],
            sets: [1],
            reps: ["30 - 50 min"], // extended for core
            rest: [0],
            tags: {
                role: "core",
                target: "cardio",
                athlete: false,
                routine: "cardio"
            }
        },
        {
            name: ["Rowing Machine Intervals", "Air Bike Intervals"],
            sets: [5, 6],
            reps: ["45s high intensity", "75s slow pace"],
            rest: [90],
            tags: {
                role: "main",
                target: "cardio",
                athlete: false,
                routine: "cardio"
            }
        },
        {
            name: ["Lap Swimming", "Deep Water Jogging"],
            sets: [1],
            reps: ["30 - 45 min"],
            rest: [0],
            tags: {
                role: "main",
                target: "cardio",
                athlete: true,
                routine: "cardio"
            }
        },
        {
            name: ["Resistance Bike"],
            sets: [6, 8],
            reps: ["20s sprint"],
            rest: [15],
            tags: {
                role: "main",
                target: "cardio",
                athlete: true,
                routine: "cardio"
            }
        },
        {
            name: ["Hill Sprints"],
            sets: [6, 8],
            reps: ["12s sprint"],
            rest: [30],
            tags: {
                role: "main",
                target: "cardio",
                athlete: true,
                routine: "cardio"
            }
        },
    ];

    return exercises;
}