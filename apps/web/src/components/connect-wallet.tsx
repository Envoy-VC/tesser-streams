import { useAppKit } from '@reown/appkit/react';
import { Button } from '@tesser-streams/ui/components/button';
import { Dialog, DialogContent } from '@tesser-streams/ui/components/dialog';
import { LockKeyholeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export const ConnectWallet = () => {
  const { address } = useAccount();
  const [open, setOpen] = useState<boolean>(true);
  const { open: openModal } = useAppKit();

  useEffect(() => {
    if (address) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [address]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className='card-gradient !p-8 !rounded-3xl flex w-[28rem] flex-col gap-4 border'>
        <div className='mx-auto flex size-16 items-center justify-center rounded-full border'>
          <LockKeyholeIcon
            size={32}
            className='text-primary'
          />
        </div>
        <div className='text-center text-neutral-200 text-xl'>
          Connection Required
        </div>
        <div className='text-center text-base text-neutral-400'>
          To proceed, please connect your wallet. This step ensures secure
          access and seamless interaction with the application.
        </div>
        <Button
          className='!font-medium !rounded-xl my-3'
          onClick={() => {
            openModal();
          }}
        >
          Connect Wallet
        </Button>
      </DialogContent>
    </Dialog>
  );
};
