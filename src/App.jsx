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

  // ✅ Fetch Items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json();
        console.log("Fetched items:", listItems);  // ✅ Debugging output
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // ✅ Add Item to API
  const addItem = async (item) => {
    const myNewItem = { checked: false, item };  // API will auto-generate ID

    const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(myNewItem)
    };

    try {
      const response = await fetch(API_URL, postOptions);
      if (!response.ok) throw new Error("Failed to add item");

      const result = await response.json();
      console.log("Added item:", result);  // ✅ Debugging output

      setItems(prevItems => [...prevItems, result]); // ✅ Ensure correct item addition
      setFetchError(null);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // ✅ Handle Checkbox Toggle
  const handleCheck = async (id) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);

    const updatedItem = updatedItems.find(item => item.id === id);
    
    const updateOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: updatedItem.checked })
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, updateOptions);
      if (!response.ok) throw new Error("Failed to update item");
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    const deleteOptions = { method: 'DELETE' };

    try {
      const response = await fetch(`${API_URL}/${id}`, deleteOptions);
      if (!response.ok) throw new Error("Failed to delete item");
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // ✅ Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addItem(newItem);
    setNewItem('');
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
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
