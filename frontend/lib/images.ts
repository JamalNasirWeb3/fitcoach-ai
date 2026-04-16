export type Gender = "male" | "female" | "other" | null | undefined;

const q = "?w=1400&q=80&fit=crop&auto=format";
const qs = "?w=800&q=80&fit=crop&auto=format";

export const workoutImages = {
  male: {
    banner:   `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b${q}`,   // man on treadmill
    generate: `https://images.unsplash.com/photo-1526506118085-60ce8714f8c5${qs}`,  // dumbbells rack
    detail:   `https://images.unsplash.com/photo-1517836357463-d25dfeac3438${q}`,   // man doing pull-ups
    card:     `https://images.unsplash.com/photo-1583454110551-21f2fa2afe61${qs}`,  // barbell close-up
  },
  female: {
    banner:   `https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb${q}`,   // woman running
    generate: `https://images.unsplash.com/photo-1552196563-55cd4e45efb3${qs}`,     // woman yoga/stretch
    detail:   `https://images.unsplash.com/photo-1518611012118-696072aa579a${q}`,   // woman at gym
    card:     `https://images.unsplash.com/photo-1594737625785-a6cbdabd333c${qs}`,  // woman lifting
  },
  default: {
    banner:   `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b${q}`,
    generate: `https://images.unsplash.com/photo-1526506118085-60ce8714f8c5${qs}`,
    detail:   `https://images.unsplash.com/photo-1534438327276-14e5300c3a48${q}`,
    card:     `https://images.unsplash.com/photo-1583454110551-21f2fa2afe61${qs}`,
  },
};

export function getWorkoutImages(gender: Gender) {
  if (gender === "male") return workoutImages.male;
  if (gender === "female") return workoutImages.female;
  return workoutImages.default;
}
