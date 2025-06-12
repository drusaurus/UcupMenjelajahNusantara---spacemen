// components/ui/ActivityDetailModal.jsx
"use client";

import React, {useState} from 'react';
import {useGame} from '../../hooks/useGame'; // For playerStatus and startPlayerActivity
import {useInventory} from '../../hooks/useInventory'; // For checking item requirements/costs
import {ITEMS} from '../../constants/items';
import useActivity from "../../hooks/useActivity.js"; // For item definitions
import {useGameTime} from "../../hooks/useGameTime.js";

// Helper to format requirements, costs, effects, rewards
const DetailSection = ({ title, items, colorClass = "text-white" }) => {
    if (
        !items ||
        (Array.isArray(items) && items.length === 0) ||
        (typeof items === 'object' && Object.keys(items).length === 0 && !Array.isArray(items))
    ) {
        return null;
    }

    const renderObjectDetails = (obj) => {
        return Object.entries(obj).map(([key, value]) => (
            <li key={key} className="text-xs">
                <span className="capitalize font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
                {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
            </li>
        ));
    };

    const renderArrayDetails = (arr) => {
        return arr.map((item, index) => (
            <li key={item.id || item.itemId || index} className="text-xs flex items-center space-x-1">
                {/* Placeholder for item icon: e.g. {item.itemId && <ItemIcon itemId={item.itemId} className="w-3 h-3" />} */}
                <span>{item.name || item.itemId || JSON.stringify(item)}</span>
                {item.quantity && <span>x{item.quantity}</span>}
                {item.consume && <span className="text-red-400 text-xxs">(Consumed)</span>}
                {item.present && <span className="text-green-400 text-xxs">(Required)</span>}
            </li>
        ));
    };

    return (
        <div className="mb-3">
            <h4 className={`text-sm font-semibold mb-1 ${colorClass}`}>{title}</h4>
            <ul className="list-disc list-inside pl-1 space-y-0.5">
                {Array.isArray(items) ? renderArrayDetails(items) : renderObjectDetails(items)}
            </ul>
        </div>
    );
};

const RequirementSection = ({ requirements }) => {
    const [hoveredItemId, setHoveredItemId] = useState(null)

    if (!requirements || Object.keys(requirements).length === 0) return null

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h6 style={{ margin: 0, whiteSpace: 'nowrap' }}>Require:</h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: -4 }}>

                {/* Items */}
                {requirements.items?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {requirements.items.map(({ itemId, use, checkToolInstance }) => {
                            const item = ITEMS[itemId]
                            if (!item) return null

                            const isHovered = hoveredItemId === itemId
                            const quantityText = use ? `×${use}` : ""

                            return (
                                <div
                                    key={itemId}
                                    onMouseEnter={() => setHoveredItemId(itemId)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    style={{
                                        position: 'relative',
                                        width: 64,
                                        height: 64,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={item.sourcePath}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 6,
                                        }}
                                        className={"pixelated"}
                                    />
                                    {use && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                padding: '0 4px',
                                                borderRadius: '4px 0 4px 0',
                                            }}
                                        >
                                            {quantityText}
                                        </div>
                                    )}

                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '110%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#333',
                                                color: '#fff',
                                                padding: '6px 10px',
                                                borderRadius: 6,
                                                fontSize: '0.75rem',
                                                width: 'max-content',       // allow it to expand naturally
                                                maxWidth: '200px',
                                                whiteSpace: 'normal',
                                                zIndex: 1000,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                {item.name} {quantityText}
                                            </p>
                                            <p>{item.description}</p>
                                            {checkToolInstance && (
                                                <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                                                    Requires unique tool instance
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}


const CostSection = ({ costs }) => {
    const [hoveredItemId, setHoveredItemId] = useState(null)

    if (!costs || Object.keys(costs).length === 0) return null

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h6 style={{ margin: 0, whiteSpace: 'nowrap' }}>Costs:</h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: -4 }}>

                {/* Money */}
                {costs.money && (
                    <div style={{ color: 'gold' }} className="text-[1rem]">
                        -${costs.money} money
                    </div>
                )}

                {/* Status */}
                {costs.status &&
                    Object.entries(costs.status).map(([key, value]) => (
                        <div key={key} style={{ color: 'red' }} className="text-[1rem]">
                            {value} {key}
                        </div>
                    ))}

                {/* Items */}
                {costs.items?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {costs.items.map(({ itemId, quantity }) => {
                            const item = ITEMS[itemId]
                            if (!item) return null

                            const isHovered = hoveredItemId === itemId

                            return (
                                <div
                                    key={itemId}
                                    onMouseEnter={() => setHoveredItemId(itemId)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    style={{
                                        position: 'relative',
                                        width: 64,
                                        height: 64,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={item.sourcePath}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 6,
                                        }}
                                        className={"pixelated"}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            background: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            padding: '0 4px',
                                            borderRadius: '4px 0 4px 0',
                                        }}
                                    >
                                        ×{quantity}
                                    </div>

                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '110%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#333',
                                                color: '#fff',
                                                padding: '6px 10px',
                                                borderRadius: 6,
                                                fontSize: '0.75rem',
                                                maxWidth: '200px',          // cap width
                                                width: 'max-content',       // allow it to expand naturally
                                                whiteSpace: 'normal',       // allow text to wrap
                                                zIndex: 1000,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                {item.name} ×{quantity}
                                            </p>
                                            <p>{item.description}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}


const EffectSection = ({ effects }) => {
    if (!effects || Object.keys(effects).length === 0) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h6 style={{ margin: 0, whiteSpace: 'nowrap' }}>Effects:</h6>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: -4 }}>
                {Object.entries(effects).map(([key, value]) => (
                    <li key={key} style={{ color: value < 0 ? 'red' : 'green' }} className={"text-[1rem]"}>
                        {value > 0 ? `+${value}` : value} {key}
                    </li>
                ))}
            </ul>
        </div>
    );
};


const RewardSection = ({ rewards }) => {
    const [hovered, setHovered] = useState(null)
    const [hoveredItemId, setHoveredItemId] = useState(null)

    if (!rewards || Object.keys(rewards).length === 0) return null

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h6 style={{ margin: 0, whiteSpace: 'nowrap' }}>Rewards:</h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: -4 }}>
                {/* Player Status */}
                {rewards.playerStatus &&
                    Object.entries(rewards.playerStatus).map(([key, value]) => (
                        <div key={key} style={{ color: 'green' }} className="text-[1rem]">
                            +{value} {key}
                        </div>
                    ))}

                {/* Item Rewards */}
                {rewards.items?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {rewards.items.map(({ itemId, quantity }) => {
                            const item = ITEMS[itemId]
                            if (!item) return null
                            const hoverKey = `item:${itemId}`
                            const isHovered = hovered === hoverKey

                            return (
                                <div
                                    key={hoverKey}
                                    onMouseEnter={() => setHovered(hoverKey)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{
                                        position: 'relative',
                                        width: 64,
                                        height: 64,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={item.sourcePath}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 6,
                                        }}
                                        className="pixelated"
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            background: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            padding: '0 4px',
                                            borderRadius: '4px 0 4px 0',
                                        }}
                                    >
                                        ×{quantity}
                                    </div>

                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '110%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#333',
                                                color: '#fff',
                                                padding: '6px 10px',
                                                borderRadius: 6,
                                                fontSize: '0.75rem',
                                                maxWidth: '200px',
                                                width: 'max-content',
                                                whiteSpace: 'normal',
                                                zIndex: 1000,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                {item.name} ×{quantity}
                                            </div>
                                            <div>{item.description}</div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Possible Loots */}
                {rewards.possibleLoots?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {rewards.possibleLoots.map(({ itemId }) => {
                            const item = ITEMS[itemId];
                            if (!item) return null;

                            const hoverKey = `loot-${itemId}`;
                            const isHovered = hoveredItemId === hoverKey;

                            return (
                                <div
                                    key={hoverKey}
                                    onMouseEnter={() => setHoveredItemId(hoverKey)}
                                    onMouseLeave={() => setHoveredItemId(null)}
                                    style={{
                                        position: 'relative',
                                        width: 64,
                                        height: 64,
                                        borderRadius: 6,
                                        overflow: 'visible', // important: allow tooltip overflow
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={item.sourcePath}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 6,
                                        }}
                                        className="pixelated"
                                    />

                                    {/* Tooltip for possible loots */}
                                    {isHovered && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '110%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#333',
                                                color: '#fff',
                                                padding: '6px 10px',
                                                borderRadius: 6,
                                                fontSize: '0.75rem',
                                                maxWidth: '200px',
                                                width: 'max-content',
                                                whiteSpace: 'normal',
                                                zIndex: 1000,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <p style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                {item.name}
                                            </p>
                                            <p>{item.description}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ActivityDetailModal({
                                                activity,
                                                isOpen,
                                                onClose,
                                                // onStartActivity prop is no longer directly used if startPlayerActivity from useGame is called internally
                                            }) {
    const { playerStatus, dispatch } = useGame();
    const { startPlayerActivity } = useActivity();
    const { countPlayerItem } = useInventory();
    const { timeOfDay, hour } = useGameTime();

    if (!isOpen || !activity) {
        return null;
    }



    const handleStartActivityClick = () => {
        const activityStarted = startPlayerActivity(activity); // Pass the full activity object
        if (activityStarted) {
            onClose(); // Close modal only if activity successfully starts
        } else {
            console.warn("Activity could not be started (likely due to unmet requirements/costs checked in startPlayerActivity).");
            // Optionally, dispatch a notification to the UI
        }
    };

    const handlePanelClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Close on overlay click
        >
            <div
                className="bg-neutral-800 text-white p-5 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={handlePanelClick} // Stop propagation for clicks inside
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-bold">{activity.name}</h5>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white text-2xl leading-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-3 text-xs">
                    {activity.icon && (
                        <div className="flex justify-center mb-3">
                            <img
                                src={activity.icon}
                                alt={activity.name}
                                className="w-16 h-16 pixelated rounded-md border-2 border-neutral-700"
                            />
                        </div>
                    )}
                    <p className="text-neutral-300 mb-3 text-sm leading-relaxed">
                        {activity.description}
                    </p>

                    {activity.duration !== undefined && (
                        <p>
                            <span className="font-semibold text-neutral-400">Duration:</span> {activity.duration} minutes
                        </p>
                    )}

                    {/* Requirements */}
                    {activity.requirements &&
                        (<RequirementSection requirements={activity.requirements} />
                        )}
                    {/*{activity.requirements?.items && activity.requirements.items.length > 0 && (*/}
                    {/*    <DetailSection title="Requirements" items={activity.requirements.items} colorClass="text-yellow-400" />*/}
                    {/*)}*/}
                    {/*{activity.requirements?.stats && Object.keys(activity.requirements.stats).length > 0 && (*/}
                    {/*    <DetailSection title="Stat Requirements" items={activity.requirements.stats} colorClass="text-yellow-400" />*/}
                    {/*)}*/}
                    {/*{activity.requirements?.achievements && activity.requirements.achievements.length > 0 && (*/}
                    {/*    <DetailSection title="Achievement Requirements" items={activity.requirements.achievements.map(ach => ({name: ach}))} colorClass="text-yellow-400" />*/}
                    {/*)}*/}

                    {/* Costs */}
                    {activity.costs &&
                    (<CostSection costs={activity.costs} />)
                    }
                    {/*{activity.costs?.items && activity.costs.items.length > 0 && (*/}
                    {/*    <DetailSection title="Cost" items={activity.costs.items} colorClass="text-white" />*/}
                    {/*)}*/}
                    {/*{activity.costs?.gold && (*/}
                    {/*    <DetailSection title="Cost (Gold)" items={{gold: activity.costs.gold}} colorClass="text-red-400" />*/}
                    {/*)}*/}
                    {/*{activity.costs?.energy && (*/}
                    {/*    <DetailSection title="Cost (Energy)" items={{energy: activity.costs.energy}} colorClass="text-red-400" />*/}
                    {/*)}*/}

                    {/* Effects */}
                    {activity.effects && <EffectSection effects={activity.effects} />}
                    {/*{activity.effects && Object.keys(activity.effects).length > 0 && (*/}
                    {/*    <DetailSection title="Effects (during/on completion)" items={activity.effects} colorClass="text-green-400" />*/}
                    {/*)}*/}

                    {/*/!* Rewards *!/*/}
                    {activity.rewards &&
                    (<RewardSection rewards={activity.rewards} />)
                    }
                    {/*{activity.rewards?.items && activity.rewards.items.length > 0 && (*/}
                    {/*    <DetailSection title="Rewards (Items)" items={activity.rewards.items} colorClass="text-teal-400" />*/}
                    {/*)}*/}
                    {/*{activity.rewards?.playerStatus && Object.keys(activity.rewards.playerStatus).length > 0 && (*/}
                    {/*    <DetailSection title="Rewards (Status)" items={activity.rewards.playerStatus} colorClass="text-teal-400" />*/}
                    {/*)}*/}
                    {/*{activity.rewards?.experience && Object.keys(activity.rewards.experience).length > 0 &&(*/}
                    {/*    <DetailSection title="Rewards (XP)" items={activity.rewards.experience} colorClass="text-teal-400" />*/}
                    {/*)}*/}
                    {/*{activity.rewards?.currency && ( // Assuming currency is an object like {type: "coins", amount: 5}*/}
                    {/*    <DetailSection title="Rewards (Currency)" items={activity.rewards.currency} colorClass="text-teal-400" />*/}
                    {/*)}*/}
                </div>

                {/* Modal Footer - Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={handleStartActivityClick}
                        // disabled={!canPerformActivity}
                        // className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800
                        //             ${canPerformActivity
                        //     ? 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500'
                        //     : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                        // }`}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 bg-sky-600 hover:bg-sky-700 focus:ring-sky-500`}
                        
                        // title={!canPerformActivity ? "Requirements not met or cannot afford costs" : `Start: ${activity.name}`}
                        title = {`Start: ${activity.name}`}
                    >
                        Start Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
