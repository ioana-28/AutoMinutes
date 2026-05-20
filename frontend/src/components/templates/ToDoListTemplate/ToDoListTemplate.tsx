import { FC } from 'react';
import MeetingLayoutTemplate from '@templates/MeetingLayoutTemplate/MeetingLayoutTemplate';
import { IToDoListTemplateProps } from './IToDoListTemplate';

const ToDoListTemplate: FC<IToDoListTemplateProps> = ({
  navbarSlot,
  toolbarSlot,
  children,
  modalSlot,
  contentClassName,
}) => (
  <MeetingLayoutTemplate
    navbarSlot={navbarSlot}
    toolbarSlot={toolbarSlot}
    contentClassName={contentClassName}
  >
    {children}
    {modalSlot ?? null}
  </MeetingLayoutTemplate>
);

export default ToDoListTemplate;
