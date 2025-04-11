import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useValidateAdmin } from '@/hooks/api/admin.queries';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { Card } from './ui/card';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '@/store/slices/authSlice';

const AdminPinPopover = () => {
  const [open, setOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const { mutateAsync: handleValidateAdmin, isPending } = useValidateAdmin();
  const admin = useTypedSelector((state) => state.auth.is_admin);
  const admin_session_key = useTypedSelector((state) => state.auth.admin_session_key);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    await handleValidateAdmin({ admin_pin: pinInput });
    setPinInput('');
    setOpen(false);
  };

  const handleCancel = () => {
    setPinInput('');
    setOpen(false);
  };

  return (
    <div
      className={`flex flex-col mt-auto p-4 gap-1 bg-gradient-to-b from-transparent ${
        admin && admin_session_key ? 'to-green-200' : 'to-blue-200'
      }  rounded-xl`}
    >
      {admin && admin_session_key ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted font-bold text-red-600">Viewing as Admin</span>

          <Button variant="outline" className="hover:bg-primary hover:text-white" onClick={() => dispatch(logoutAdmin())}>
            View as User
          </Button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="hover:bg-primary hover:text-white">
              View as Admin
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 mt-auto  flex flex-col gap-3">
            <div className="text-sm font-medium">Enter 4-digit Admin PIN</div>
            <Input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="text-center tracking-widest"
            />
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button loading={isPending} onClick={handleSubmit} disabled={pinInput.length !== 4}>
                Submit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <span className="text-xs mx-auto mt-0 ">Section Only Visible By Admins</span>
    </div>
  );
};

export default AdminPinPopover;
