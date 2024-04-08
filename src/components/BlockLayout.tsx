import React, {ReactNode} from 'react';
interface Props {
    children: ReactNode;
    className?: string;
}

const BLockLayout: React.FC<Props> = ({children,className})=>{
return (
    <div className={`isolate shadow-lg ring-1 ring-black/5 rounded-2xl bg-white/10 bg-opacity-45 ${className}`}>
        {children}
    </div>
 )
}

export default BLockLayout;