import { FC } from 'react';

import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';

interface IDeleteConfirmationPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopup: FC<
  IDeleteConfirmationPopupProps
> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Popup
      isOpen={isOpen}
      variant="confirm"
      titleId="delete-popup-title"
      panelClassName="
        w-full
        max-w-[520px]
        overflow-hidden
        rounded-[40px]
        bg-[#386641]
        p-0
      "
    >
      <div className="relative">

        <button
          onClick={onCancel}
          className="
            absolute
            right-5
            top-5
            z-10
            text-5xl
            font-bold
            text-pink-300
          "
        >
          ✕
        </button>

        <div
          className="
            rounded-b-[40px]
            bg-[#cad2c5]
            px-10
            py-14
            text-center
          "
        >
          <h2
            id="delete-popup-title"
            className="
              text-4xl
              font-bold
              uppercase
              leading-tight
              text-white
            "
          >
            ARE YOU SURE YOU WANT TO DELETE?
          </h2>
        </div>

        <div
          className="
            flex
            items-center
            justify-center
            gap-8
            px-8
            py-8
          "
        >
          <button
            onClick={onConfirm}
            className="
              min-w-[160px]
              rounded-[24px]
              bg-pink-300
              px-8
              py-4
              text-3xl
              font-semibold
            "
          >
            YES
          </button>

          <button
            onClick={onCancel}
            className="
              min-w-[160px]
              rounded-[24px]
              bg-[#d9f0ee]
              px-8
              py-4
              text-3xl
              font-semibold
            "
          >
            NO
          </button>
        </div>

      </div>
    </Popup>
  );
};

export default DeleteConfirmationPopup;

/* import { FC } from 'react';

import Popup from '@atoms/Popup/Popup';
import Button from '@atoms/Button/Button';

interface IDeleteConfirmationPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopup: FC<
  IDeleteConfirmationPopupProps
> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Popup
      isOpen={isOpen}
      variant="confirm"
      titleId="delete-popup-title"
    >
      <h2 id="delete-popup-title">
        ARE YOU SURE YOU WANT TO DELETE?
      </h2>

      <div data-popup-actions>
        <Button
          label="YES"
          variant="nav"
          onClick={onConfirm}
        />

        <Button
          label="NO"
          variant="nav"
          onClick={onCancel}
        />
      </div>
    </Popup>
  );
};

export default DeleteConfirmationPopup; */