import { Check, X } from 'lucide-react';
import React, { useEffect } from 'react';
interface PasswordCheckerProps {
  password: string;
}
const PasswordChecker: React.FC<PasswordCheckerProps> = (props) => {
  const { password } = props;
  //HOOKS

  //STATES

  //VARIABLES
  const passwordTest = { lower: '', upper: '', number: '', special: '', length: '' };
  const lights = [
    {
      id: 1,
      color: 'bg-red-200',
      label: 'Weak',
      score: 20,
    },
    {
      id: 2,
      color: 'bg-red-200',
      label: 'Weak',
      score: 40,
    },
    {
      id: 3,
      color: 'bg-yellow-200',
      label: 'Fair',
      score: 60,
    },
    {
      id: 4,
      color: 'bg-yellow-200',
      label: 'Almost',
      score: 80,
    },
    {
      id: 5,
      color: 'bg-green-300',
      label: 'Strong!',
      score: 100,
    },
  ];

  //FUNCTIONS
  const passwordStrength = () => {
    let strength = 0;
    if (password?.length > 5) {
      strength += 20;
    }
    if (password?.match(/[a-z]+/)) {
      strength += 20;
    }
    if (password?.match(/[A-Z]+/)) {
      strength += 20;
    }
    if (password?.match(/[0-9]+/)) {
      strength += 20;
    }
    if (password?.match(/[!@#$%^&*()]+/)) {
      strength += 20;
    }
    return strength;
  };

  //EFFECTS
  useEffect(() => {
    passwordStrength();
  }, [password]);
  console.log(password);
  console.log(passwordStrength());
  return <>
    <div className="flex flex-row justify-content-between ">
      {lights.map((light) => {
        return (
          <div
            style={{ width: '55px' }}
            key={light.id}
            className={`mx-auto h-3 rounded-xl ${passwordStrength() >= light.score ? light.color : 'bg-blue-300'}`}
          />
        );
      })}
    </div>
    <div className="flex flex-col mt-2 text-sm">
      <p className={`my-0 ${password && password.length >= 6 ? 'text-green-500' : 'text-red-300'}`}>
        {password && password.length >= 6 ? <Check className="me-2 w-4 h-4 inline" /> : <X className="me-2 w-4 h-4 inline" />}
        Minimum of 6 characters
      </p>
      <p className={`my-0 ${password && /[A-Z]/.test(password) ? 'text-green-500' : 'text-red-300'}`}>
        {password && /[A-Z]/.test(password) ? <Check className="me-2 w-4 h-4 inline" /> : <X className="me-2 w-4 h-4 inline" />}
        At least 1 uppercase letter
      </p>
      <p className={`my-0 ${password && /[a-z]/.test(password) ? 'text-green-500' : 'text-red-300'}`}>
        {password && /[a-z]/.test(password) ? <Check className="me-2 w-4 h-4 inline" /> : <X className="me-2 w-4 h-4 inline" />}
        At least 1 lowercase letter
      </p>
      <p className={`my-0 ${password && /\d/.test(password) ? 'text-green-500' : 'text-red-300'}`}>
        {password && /\d/.test(password) ? <Check className="me-2 w-4 h-4 inline" /> : <X className="me-2 w-4 h-4 inline" />}
        At least 1 number
      </p>
      <p className={`my-0 ${password && /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-500' : 'text-red-300'}`}>
        {password && /[!@#$%^&*(),.?":{}|<>]/.test(password) ? <Check className="me-2 w-4 h-4 inline" /> : <X className="me-2 w-4 h-4 inline" />}
        At least 1 special character
      </p>
    </div>

  </>;
};

export default PasswordChecker;
