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
  const gate = document.getElementById('gate').value;
  const zone = document.getElementById('zone').value;
  const upto = document.getElementById('upto').value;
  
  // Validate date format (dd/mm/yyyy)
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(upto)) {
    alert('Date must be in dd/mm/yyyy format.');
    return;
  }

  // Error handling: Ensure all values are not empty
  if (!veh_num || !veh_mod || !owner || !complex || !gate || !zone || !upto) {
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
      gate: gate,
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
    // Query to find the document with the specific vehicle number
    const vehiclesRef = collection(window.db, 'allowedVehicles');
    const q = query(vehiclesRef, where('veh_num', '==', veh_num));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      alert('Vehicle not found.');
      return;
    }

    // Delete the document(s)
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Document deleted with ID: ', doc.id);
    });

    alert('Vehicle deleted successfully!');
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    alert('Error deleting vehicle. Please check the console for more details.');
  }
});

// Function to delete expired vehicles
document.getElementById('deleteExpiredVehicles').addEventListener('click', async () => {
  const today = formatDate(new Date());

  try {
    // Query to find all expired vehicles
    const vehiclesRef = collection(window.db, 'allowedVehicles');
    const q = query(vehiclesRef, where('upto', '<', today));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      alert('No expired vehicles found.');
      return;
    }

    // Delete the documents
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Expired vehicle document deleted with ID: ', doc.id);
    });

    alert('Expired vehicles deleted successfully!');
  } catch (error) {
    console.error('Error deleting expired vehicles:', error);
    alert('Error deleting expired vehicles. Please check the console for more details.');
  }
});

// Function to fetch all vehicle details
document.getElementById('getAllVehicles').addEventListener('click', async () => {
  try {
    const vehiclesRef = collection(window.db, 'allowedVehicles');
    const querySnapshot = await getDocs(vehiclesRef);
    
    if (querySnapshot.empty) {
      alert('No vehicles found.');
      return;
    }

    // Clear the previous list
    const tbody = document.querySelector('#vehicleTable tbody');
    tbody.innerHTML = '';

    // Populate the table with the vehicle data
    querySnapshot.forEach((doc) => {
      const vehicle = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehicle.veh_num}</td>
        <td>${vehicle.veh_mod}</td>
        <td>${vehicle.owner}</td>
        <td>${vehicle.complex}</td>
        <td>${vehicle.gate}</td>
        <td>${vehicle.zone}</td>
        <td>${vehicle.upto}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    alert('Error fetching vehicle details. Please check the console for more details.');
  }
});
