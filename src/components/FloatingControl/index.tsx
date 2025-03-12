import { PlayIcon, Cross1Icon, CopyIcon, PlusIcon, GearIcon } from '@radix-ui/react-icons';
import { TabLink, StyledControl, ControlButton } from "./StyledComponents";

interface FloatingControlProps {
    activeTab?: string;
    onPlay: () => void;
    onClear: () => void;
    onClone: () => void;
    onAdd?: () => void;
    onPlus: () => void;
    onSettings: () => void;
}

const FloatingControl = ({ activeTab, onPlay, onClear, onClone, onPlus, onSettings }: FloatingControlProps) => {
    return (
        <StyledControl>
            <TabLink active={activeTab === 'play'}>
                <ControlButton onClick={onPlay}>
                    <PlayIcon />
                </ControlButton>
            </TabLink>
            <TabLink active={activeTab === 'clear'}>
                <ControlButton onClick={onClear}>
                    <Cross1Icon />
                </ControlButton>
            </TabLink>
            <TabLink active={activeTab === 'clone'}>
                <ControlButton onClick={onClone}>
                    <CopyIcon />
                </ControlButton>
            </TabLink>
            <TabLink active={activeTab === 'add'}>
                <ControlButton onClick={onPlus}>
                    <PlusIcon />
                </ControlButton>
            </TabLink>
            <TabLink active={activeTab === 'settings'}>
                <ControlButton onClick={onSettings}>
                    <GearIcon />
                </ControlButton>
            </TabLink>
        </StyledControl>
    );
};

export default FloatingControl;
