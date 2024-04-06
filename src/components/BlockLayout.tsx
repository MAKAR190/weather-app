import React, {ReactNode} from 'react';
interface Props {
    children: ReactNode;
    className?: string;
}

const BLockLayout: React.FC<Props> = ({children,className})=>{
return (
    <div className={`rounded-2xl bg-[#001026] bg-opacity-45 ${className}`}>
        {children}
    </div>
 )
}

export default BLockLayout;