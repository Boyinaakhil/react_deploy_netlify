import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';

function App() {
  const API_URL = 'https://67d528ded2c7857431ef8b0f.mockapi.io/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch items');
        
        const listItems = await response.json();
        console.log("Fetched items:", listItems); // ✅ Debug log
        setItems(listItems);
        setFetchError(null);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => fetchItems(), 1000);
  }, []);

  // Add Item
  const addItem = async (item) => {
    const newItemObj = { checked: false, item };

    const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItemObj)
    };

    try {
      const response = await fetch(API_URL, postOptions);
      if (!response.ok) throw new Error("Failed to add item");

      const result = await response.json();
      console.log("Added item:", result); // ✅ Debug log
      setItems(prevItems => [...prevItems, result]);
      setFetchError(null);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Update Item (Check/Uncheck)
  const handleCheck = async (id) => {
    console.log(`Updating item with ID: ${id}`); // ✅ Debug log

    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);

    const updateOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: updatedItems.find(item => item.id === id).checked })
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, updateOptions);
      if (!response.ok) throw new Error(`Failed to update item with ID ${id}`);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    console.log(`Deleting item with ID: ${id}`); // ✅ Debug log

    setItems(items.filter(item => item.id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete item with ID ${id}`);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit} />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter(item => item.item && item.item.toLowerCase().includes(search.toLowerCase()))}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
