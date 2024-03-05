import { useHover } from '@uidotdev/usehooks';
import React from 'react';

import { cn } from '@/lib/utils';

import { Logo } from './Logo';
import { SideNavMenu } from './SideNavMenu';

type Props = {
  fixed?: boolean;
};

export function SideNav({ fixed = false }: Props) {
  const [ref, hovering] = useHover();

  // render functions
  const renderPlaceHolder = () => {
    // render an empty placeholder that has the same dimensions as SideNav
    return <div className="size-full" />;
  };

  return (
    <div className="relative min-h-full w-16">
      {renderPlaceHolder()}
      <div
        className={cn(
          'fixed top-0 left-0 h-full flex flex-col box-border border-r border-gray-300 z-1000 bg-white/80 backdrop-blur',
          hovering ? 'w-80' : 'w-16'
        )}
        ref={ref}
      >
        <div className={cn('flex items-center', hovering ? 'm-6' : 'm-4')}>
          <Logo expanded={hovering} />
        </div>
        <SideNavMenu
          expanded={hovering}
          // onConversationClick={() => {}}
          // onTemplatesClick={() => {}}
          // onModelsClick={() => {}}
          // onSettingsClick={() => {}}
        />
      </div>
    </div>
  );
}