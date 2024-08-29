import { collection, addDoc, deleteDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Function to format date as dd/mm/yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to handle form submission
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form values
  const veh_num = document.getElementById('veh_num').value;
  const veh_mod = document.getElementById('veh_mod').value;
  const owner = document.getElementById('owner').value;
  const complex = document.getElementById('complex').value;
  const zone = document.getElementById('zone').value;
  const upto = document.getElementById('upto').value;
  
  // Validate date format (dd/mm/yyyy)
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(upto)) {
    alert('Date must be in dd/mm/yyyy format.');
    return;
  }

  // Error handling: Ensure all values are not empty
  if (!veh_num || !veh_mod || !owner || !complex || !zone || !upto) {
    alert('All fields are required.');
    return;
  }

  try {
    // Reference to the collection
    const vehiclesRef = collection(window.db, 'allowedVehicles');

    // Add a new document with a generated ID
    const docRef = await addDoc(vehiclesRef, {
      veh_num: veh_num,
      veh_mod: veh_mod,
      owner: owner,
      complex: complex,
      zone: zone,
      upto: upto,
    });

    console.log('Document written with ID: ', docRef.id);

    alert('Vehicle details uploaded successfully!');
    // Clear form after successful submission
    document.getElementById('vehicleForm').reset();
  } catch (error) {
    console.error('Error uploading vehicle details:', error);
    alert('Error uploading vehicle details. Please check the console for more details.');
  }
});

// Function to delete a specific vehicle
document.getElementById('deleteSpecificVehicle').addEventListener('click', async () => {
  const veh_num = document.getElementById('deleteVehNum').value;
  
  if (!veh_num) {
    alert('Vehicle Number is required.');
    return;
  }

  try {
    // Query to find the document with the specified vehicle number
    const vehiclesRef = collection(window.db, 'allowedVehicles');
    const q = query(vehiclesRef, where('veh_num', '==', veh_num));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      alert('No vehicle found with this number.');
      return;
    }

    // Delete the documents
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Document deleted with ID: ', doc.id);
    });

    alert('Vehicle deleted successfully!');
    document.getElementById('deleteVehNum').value = ''; // Clear input field
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    alert('Error deleting vehicle. Please check the console for more details.');
  }
});

// Function to delete expired vehicles
document.getElementById('deleteExpiredVehicles').addEventListener('click', async () => {
  try {
    const today = new Date();
    const formattedToday = formatDate(today);

    // Query to find documents with 'upto' date less than today
    const vehiclesRef = collection(window.db, 'allowedVehicles');
    const q = query(vehiclesRef, where('upto', '<', formattedToday));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert('No expired vehicles found.');
      return;
    }

    // Delete the expired documents
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Expired document deleted with ID: ', doc.id);
    });

    alert('Expired vehicles deleted successfully!');
  } catch (error) {
    console.error('Error deleting expired vehicles:', error);
    alert('Error deleting expired vehicles. Please check the console for more details.');
  }
});
