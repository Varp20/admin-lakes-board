import { ReactNode } from 'react';

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="topbar">
      <h1 className="page-title">{title}</h1>
      {action}
    </div>
  );
}
