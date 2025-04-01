import { Exercise } from "@/Api/interfaces/Response";

interface IRecentWorkoutAtom {
  exercise: Exercise;
}

const RecentWorkoutAtom = ({ exercise}: IRecentWorkoutAtom) => {
  return (
    <div className="mb-2">
      <p className="font-semibold text-[#edfafa]">{exercise.name}</p>
      <p className="text-sm text-gray-400">
        {exercise.sets.map((set, setIndex) => (
          <span key={setIndex}>
            {set.weight}kg x {set.reps}
            {setIndex < exercise.sets.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
    </div>
  );
};

export default RecentWorkoutAtom;
