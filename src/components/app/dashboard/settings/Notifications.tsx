import { User } from "@/constants/models/object.types";
import { useGetUser, useUpdateUserProfile } from "@/hooks/api/users.queries";
import React, { useCallback, useEffect, useState } from "react";


const notificationFields = [
  {
    key: "receive_email",
    title: "Email Notifications",
    description: "Receive notifications via email.",
  },
  {
    key: "receive_sms",
    title: "SMS Notifications",
    description: "Receive notifications via SMS.",
  },
  {
    key: "receive_push",
    title: "Push Notifications",
    description: "Receive notifications on your device.",
  },
  {
    key: "receive_promotional",
    title: "Promotional Notifications",
    description: "Receive promotional and marketing emails.",
  },
];


const Notifications: React.FC = () => {

  const { data: userData, isSuccess } = useGetUser();
  const { mutateAsync: updateNotifications, isPending } = useUpdateUserProfile();
  const [values, setValues] = useState({
    receive_email: userData?.receive_email,
    receive_sms: userData?.receive_sms,
    receive_push: userData?.receive_push,
    receive_promotional: userData?.receive_promotional,
  });

  const handleToggleChange = useCallback(
    (key: string, checked: boolean) => {
      setValues((prevValues) => {
        const updatedValues = { ...prevValues, [key]: checked };
        updateNotifications(updatedValues as User);
        return updatedValues;
      });
    },
    []
  );

  useEffect(() => {
    if (isSuccess) {
      setValues({
        receive_email: userData?.receive_email,
        receive_sms: userData?.receive_sms,
        receive_push: userData?.receive_push,
        receive_promotional: userData?.receive_promotional,
      });
    }
  }, [userData, isSuccess]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold">Notification Settings</h2>
      <div className="flex flex-col gap-4 mt-4 justify-between w-full">
        {notificationFields.map(({ key, title, description }) => (
          <div className="grid grid-cols-4 w-full" key={key}>
            <div className="col-span-4 md:col-span-3">
              <h4 className="font-semibold mb-0">{title}</h4>
              <p className="mt-0">{description}</p>
            </div>
            <div className="col-span-4 flex md:col-span-1">
              <label className="inline-flex items-center me-5 cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={values[key as string] as boolean} onChange={(e) => handleToggleChange(key, e.target.checked)} />
                <div className="relative w-11 h-6 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-muted peer-focus:muted dark:peer-focus:primary dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-muted after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>

              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
