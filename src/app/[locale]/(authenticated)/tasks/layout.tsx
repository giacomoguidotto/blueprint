interface TasksLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function TasksLayout({ children, modal }: TasksLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
