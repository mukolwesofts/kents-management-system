import ShoppingList from './components/ShoppingList';

export default function ShoppingListPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-teal-700 mb-4">Shopping List</h1>
            </div>

            <ShoppingList />
        </div>
    );
}
