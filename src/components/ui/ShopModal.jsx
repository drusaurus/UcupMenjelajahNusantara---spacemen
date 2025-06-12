import { useState, useEffect } from "react";
import { useGame } from "../../hooks/useGame.js";
import {ITEMS} from "../../constants/items.js";
import {useInventory} from "../../hooks/useInventory.js";


const ShopModal = ({ isOpen, onClose, shopId }) => {
    const [shopItems, setShopItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalHeader, setModalHeader] = useState("");

    const { shops } = useGame()
    const { buyItem } = useInventory();

    useEffect(() => {
        if (!shopId || !shops?.[shopId]) return;

        const shopEntries = shops[shopId];
        const modalHeader = shopEntries.modalHeader;
        const getItems = shopEntries.items.map((entry) => {
            const item = ITEMS[entry.itemId];
            if (!item) return null;

            // Clone the item and add quantity (default to 1 if not specified)
            return {
                ...item,
                itemId: entry.itemId,
                quantity: entry.quantity ?? 1,
            };
        }).filter(Boolean); // Remove nulls in case of missing items

        setModalHeader(modalHeader);
        setShopItems(getItems);
        console.log("Shop items set:", getItems);
    }, [shopId, shops]);

    const handleBuyClick = (item) => {
        setSelectedItem(item);
    };

    const confirmPurchase = () => {
        if (selectedItem) {
            console.log(`Purchased ${selectedItem.name} from shop ${shopId}`);
            buyItem(selectedItem);
            setSelectedItem(null);
            // onClose(); // Optionally close modal after purchase
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Shop Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
                    <div className="bg-neutral-800 rounded-lg shadow-lg max-w-3xl max-h-[90vh] min-h-[50vh] w-full mx-4 p-6 z-50 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h6 className="text-xl font-bold">{modalHeader}</h6>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={onClose}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable grid section */}
                        <div className="flex-grow overflow-y-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {shopItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-neutral-900 rounded-lg p-3 bg-neutral-700 justify-center items-center flex flex-col text-center min-h-[40vh]"
                                    >
                                        <img
                                            src={`${item.sourcePath}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain mb-2 pixelated"
                                        />
                                        <p className="font-semibold text-md">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                        <div className="mt-auto w-full flex items-center justify-between">
                                            <p className="font-medium text-green-400 text-md">
                                                {item.price * item.quantity} $
                                            </p>
                                            <button
                                                onClick={() => handleBuyClick(item)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Buy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
                    <div className="rounded-lg p-6 shadow-lg max-w-sm w-full mx-4 text-center bg-neutral-800 justify-center items-center flex flex-col">
                        <h3 className="text-lg font-semibold mb-6">Confirm Purchase</h3>
                        <img
                            src={`${selectedItem.sourcePath}`}
                            alt={selectedItem.name}
                            className="w-16 h-16 object-contain mb-2 pixelated"
                        />
                        <p className="text-sm mb-4">
                            Are you sure you want to buy{" "}
                            <span className="font-medium">{selectedItem.name}</span> for{" "}
                            <span className="text-green-400 text-xl font-bold">{selectedItem.price * selectedItem.quantity}$</span> ?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPurchase}
                                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                style={{
                                    backgroundColor: "#3c903f",
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopModal;
