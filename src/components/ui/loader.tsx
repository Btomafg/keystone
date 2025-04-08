
interface LoaderProps {
  className?: string
}

const Loader: React.FC<LoaderProps> = (props) => {
    const { className } = props
    return ( <svg
        className={`animate-spin h-4 w-4 text-current` + className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l-4 4m8 0l-4 4v4a8 8 0 008-8h-4z"
        ></path>
      </svg>)}

      export default Loader