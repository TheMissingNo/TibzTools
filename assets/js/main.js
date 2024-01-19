let expInput, profitInput, timeInput, dateInput, resultadoDiv, calendarContainer, currentDate, formattedCurrentDate, calendarData;
let currentExp, targetExp, expAvg, profitAvg, ml, skill, gtPrice, imbue, stprice, st;


document.addEventListener('DOMContentLoaded', function () {
  expInput = document.querySelector('.exp');
  profitInput = document.querySelector('.profit');
  timeInput = document.querySelector('.time');
  dateInput = document.querySelector('.date');
  resultadoDiv = document.querySelector('.resultado');
  calendarContainer = document.getElementById('calendar');    
  yearTitle = document.getElementById('yearTitle');


  // Load saved calendar data from localStorage
  let storedCalendarData = localStorage.getItem('calendarData');
  calendarData = storedCalendarData ? JSON.parse(storedCalendarData) : [];

  monthTitle = document.getElementById('monthTitle');


  currentDate = new Date();
  currentYear = currentDate.getFullYear();
  yearTitle.innerHTML = currentYear;

  // Set default value for dateInput to the current date
  formattedCurrentDate = currentDate.toISOString().split('T')[0];
  dateInput.value = formattedCurrentDate;

  function renderCalendar() {
    const monthTitle = document.getElementById('monthTitle');
    // Clear previous calendar content
    calendarContainer.innerHTML = '';

    // Set the month title
    monthTitle.textContent = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Get the first day of the month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Create days in the calendar
    for (let i = 1; i <= lastDay; i++) {
      const dayData = {
        day: i,
        exp: 0,
        profit: 0,
        hours: formatTime(0)
      };

      // Check if there is saved data for this day
      const matchingData = calendarData.find(data => data.day === i && data.month === currentDate.getMonth() && data.year === currentDate.getFullYear());
      if (matchingData) {
        dayData.exp = matchingData.exp;
        dayData.profit = matchingData.profit;
        dayData.hours = matchingData.hours;
      }


// Check if there is an existing entry for this day
const existingIndex = calendarData.findIndex(data => data.day === i && data.month === currentDate.getMonth() && data.year === currentDate.getFullYear());

if (existingIndex !== -1) {
  // If entry exists, update it
  calendarData[existingIndex].exp = dayData.exp;
  calendarData[existingIndex].profit = dayData.profit;
  calendarData[existingIndex].hours = dayData.hours;
} else {
  // If entry doesn't exist, add a new one
  calendarData.push({
    day: i,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    exp: dayData.exp,
    profit: dayData.profit,
    hours: dayData.hours
  });
}

      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.innerHTML = `${dayData.day}<br>exp: ${parseFloat(dayData.exp).toFixed(2)}KK<br>profit: ${parseFloat(dayData.profit).toFixed(2)}KK<br>${dayData.hours}<br>`;
      calendarContainer.appendChild(dayElement);
    }
  }

  // Initial rendering
  renderCalendar();

// Function to navigate to the previous month
function goToPreviousMonth() {
currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
renderCalendar();
}

// Function to navigate to the next month
function goToNextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    renderCalendar();
}
// Function to navigate to the previous year
function goToPreviousYear() {
    currentYear -=1;
    yearTitle.innerHTML = '';
    yearTitle.innerHTML = currentYear;
    updateMonthlyOverviewTable();
  }
  
  // Function to navigate to the next year
  function goToNextYear() {
    currentYear +=1;
    yearTitle.innerHTML = '';
    yearTitle.innerHTML = currentYear;
    updateMonthlyOverviewTable();
  }

  function showChangeShow() {
    var changeEdit = document.getElementById('changeEdit');
    var changeShow = document.getElementById('changeShow');

    changeEdit.classList.add('hidden');
    changeShow.classList.remove('hidden');
  }

  function hideChangeShow() {
    var changeEdit = document.getElementById('changeEdit');
    var changeShow = document.getElementById('changeShow');

    changeEdit.classList.remove('hidden');
    changeShow.classList.add('hidden');
  }

    //show the side depending on values
    if (
        ( currentExp !== 0 ) ||
        ( targetExp !== 0 ) ||
        ( expAvg !== 0 ) ||
        ( profitAvg !== 0 ) ||
        ( ml !== 0 ) ||
        ( skill !== 0 ) ||
        ( gtPrice !== 0 ) ||
        ( imbue !== 0 ) ||
        ( stprice !== 0 ) ||
        ( st !== 0 )
      ) {showChangeShow()}

  // Attach event listeners
  document.querySelector('.nav-arrow:first-child').addEventListener('click', goToPreviousMonth);
  document.querySelector('.nav-arrow:last-child').addEventListener('click', goToNextMonth);
  document.querySelector('.nav-arrow-s:first-child').addEventListener('click', goToPreviousYear);
  document.querySelector('.nav-arrow-s:last-child').addEventListener('click', goToNextYear);
  document.querySelector('.setting').addEventListener('click', hideChangeShow);
  document.querySelector('.back').addEventListener('click', showChangeShow);



// Function to update the monthly overview table
function updateMonthlyOverviewTable() {
    const monthlyTable = document.querySelector('.MonthlyTable table');
    let resultArray = [];
    resultArray = [];
    totalExp=0
    totalProfit=0
    let totals = {};
    // Iterate through the data and calculate the sums
    calendarData.forEach((data) => {
        let year = data.year;
        let month = data.month;
      
        // If totals object doesn't have an entry for the current year and month, initialize it
        if (!totals[year]) {
          totals[year] = {};
        }
        if (!totals[year][month]) {
          totals[year][month] = { TotalExp: 0, TotalProfit: 0 };
        }
      
        // Accumulate the values
        totals[year][month].TotalExp += parseFloat(data.exp);
        totals[year][month].TotalProfit += parseFloat(data.profit);
      });
      
      // Iterate through the totals object and push the results into resultArray
      for (let year in totals) {
        for (let month in totals[year]) {
          resultArray.push({
            year: parseInt(year),
            month: parseInt(month),
            TotalExp: totals[year][month].TotalExp,
            TotalProfit: totals[year][month].TotalProfit,
          });
        }
      }


    // Iterate over each month in the table and update the corresponding cell
    for (let i = 1; i < monthlyTable.rows[1].cells.length; i++) {
      const monthCellProfit = monthlyTable.rows[1].cells[i];
      const monthCellExp = monthlyTable.rows[2].cells[i];
  
      // Check if there is data for the current year and month

      const targetEntry = resultArray.find((entry) => entry.year === currentYear && entry.month === i-1);
      if (targetEntry) {
        // Access the values
        const { TotalExp, TotalProfit } = targetEntry;
  
        monthCellProfit.innerText = `${parseFloat(TotalProfit).toFixed(2)}KK`;
        monthCellExp.innerText = `${parseFloat(TotalExp).toFixed(2)}KK`;
      } else {
        monthCellProfit.innerText = '';
        monthCellExp.innerText = ''; // If no data is found, clear the cell
      }
    }
  }
  
  updateMonthlyOverviewTable();

  // Attach the submitForm function to the button click event
  document.querySelector('.form-calendar button').addEventListener('click', function () {
    submitForm();
    updateMonthlyOverviewTable();
  });
});

function toggleOverlay() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.toggle('hidden');
}

function submitForm() {
  // Get the selected date from the input
  const selectedDate = new Date(dateInput.value);

  // Check if the selected date is in the current month
  if (
    selectedDate.getFullYear() === currentDate.getFullYear() &&
    selectedDate.getMonth() === currentDate.getMonth()
  ) {
    // Get the selected dayData in the calendar
    const selectedDayData = calendarData.find(data => data.day === selectedDate.getDate() && data.month === currentDate.getMonth() && data.year === currentDate.getFullYear());

    // Update dayData with form input values
    selectedDayData.exp += parseFloat(expInput.value).toFixed(2) || 0;
    selectedDayData.profit += parseFloat(profitInput.value).toFixed(2) || 0;
    selectedDayData.hours += parseInt(timeInput.value) || 0;
    selectedDayData.hours = formatTime(selectedDayData.hours);
    addExp(parseFloat(expInput.value).toFixed(2) || 0);
   
    // Update the content of the selected dayElement with updated dayData
    const selectedDayElement = calendarContainer.querySelector(`.day:nth-child(${selectedDate.getDate()})`);
    selectedDayElement.innerHTML = `${selectedDayData.day}<br>exp: ${parseFloat(selectedDayData.exp).toFixed(2)}KK<br>profit: ${parseFloat(selectedDayData.profit).toFixed(2)}KK<br>${selectedDayData.hours}<br>`;

    // Clear the form inputs
    expInput.value = '';
    profitInput.value = '';
    timeInput.value = '';
    dateInput.value = formattedCurrentDate; // Reset date input to the current date

    // Save updated calendar data to localStorage
    localStorage.setItem('calendarData', JSON.stringify(calendarData));

    // resultadoDiv.textContent = 'Data updated successfully!';
    showFeedbackMessage('Data updated successfully!', 'success');
  } else {
    showFeedbackMessage('Selected date is not in the current month!', 'error');
    // resultadoDiv.textContent = 'Selected date is not in the current month!';
  }
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursString = hours > 0 ? `${hours}h` : '';
  const minutesString = remainingMinutes > 0 ? `${remainingMinutes}min` : '';

  // Combine hours and minutes strings
  const formattedTime = `${hoursString}${minutesString}`;

  return formattedTime;
}
function saveValues() {

    // Store values in local storage
    localStorage.setItem('currentExp', currentExp);
    localStorage.setItem('targetExp', targetExp);
    localStorage.setItem('expAvg', expAvg);
    localStorage.setItem('profitAvg', profitAvg);
    localStorage.setItem('ml', ml);
    localStorage.setItem('skill', skill);
    localStorage.setItem('gtPrice', gtPrice);
    localStorage.setItem('imbue', imbue);
    localStorage.setItem('stprice', stprice);
    localStorage.setItem('st', st);



//run calculations and fill the list
fillCalculations()

}

  // Retrieve values from local storage and set default to 0 if not present or not a valid number
  document.querySelector('.current').value = parseFloat(localStorage.getItem('currentExp')) || 0;
  document.querySelector('.target').value = parseFloat(localStorage.getItem('targetExp')) || 0;
  document.querySelector('.expavg').value = parseFloat(localStorage.getItem('expAvg')) || 0;
  document.querySelector('.profitavg').value = parseFloat(localStorage.getItem('profitAvg')) || 0;
  document.querySelector('.ml').value = parseFloat(localStorage.getItem('ml')) || 0;
  document.querySelector('.skill').value = parseFloat(localStorage.getItem('skill')) || 0;
  document.querySelector('.gtprice').value = parseFloat(localStorage.getItem('gtPrice')) || 0;
  document.querySelector('.imbue').value = parseFloat(localStorage.getItem('imbue')) || 0;
  document.querySelector('.sprice').value = parseFloat(localStorage.getItem('stprice')) || 0;
  document.querySelector('.st').value = parseFloat(localStorage.getItem('st')) || 0;

  function exportData() {
    const dataToExport = {
        calendarData: calendarData,
        variables: {
            currentExp: currentExp,
            targetExp: targetExp,
            expAvg: expAvg,
            profitAvg: profitAvg,
            ml: ml,
            skill: skill,
            gtPrice: gtPrice,
            imbue: imbue,
            stprice: stprice,
            st: st
        }
    };

    const blob = new Blob([JSON.stringify(dataToExport)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'calendarAndVariables.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to handle file input change (import data)
function handleFileChange(event) {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                calendarData = importedData.calendarData;
                localStorage.setItem('calendarData', JSON.stringify(calendarData));

                // Update variables from the imported data
                const importedVariables = importedData.variables;
                currentExp = importedVariables.currentExp;
                targetExp = importedVariables.targetExp;
                expAvg = importedVariables.expAvg;
                profitAvg = importedVariables.profitAvg;
                ml = importedVariables.ml;
                skill = importedVariables.skill;
                gtPrice = importedVariables.gtPrice;
                imbue = importedVariables.imbue;
                stprice = importedVariables.stprice;
                st = importedVariables.st;

                // Update input fields with the imported variables
                document.querySelector('.current').value = currentExp;
                document.querySelector('.target').value = targetExp;
                document.querySelector('.expavg').value = expAvg;
                document.querySelector('.profitavg').value = profitAvg;
                document.querySelector('.ml').value = ml;
                document.querySelector('.skill').value = skill;
                document.querySelector('.gtprice').value = gtPrice;
                document.querySelector('.imbue').value = imbue;
                document.querySelector('.sprice').value = stprice;
                document.querySelector('.st').value = st;


                saveValues()
                showFeedbackMessage('Data imported successfully!', 'success');
            } catch (error) {
                showFeedbackMessage('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    } else {
        showFeedbackMessage('Please select a valid JSON file.', 'error');
    }

}

  
  // Add event listener for file input change
  document.getElementById('importFile').addEventListener('change', handleFileChange);


  function showFeedbackMessage(text, type) {
    const fb = document.getElementById('feedback');
    if (type.trim() === "") {
      return; // Exit the function if the type is empty
    }

    // Set text and class based on the type
    fb.textContent = text;
    fb.className = 'fb ' + type;

    // Show the fb
    fb.style.display = 'block';

    // Hide the fb after 5 seconds
    setTimeout(function () {
      fb.style.display = 'none';
    }, 5000);
  }

  function fillCalculations(){
    const calcList = document.querySelector('.calc');
    calcList.innerHTML='';
    currentExp = parseFloat(document.querySelector('.current').value) || 0;
    targetExp = parseFloat(document.querySelector('.target').value) || 0;
    expAvg = parseFloat(document.querySelector('.expavg').value) || 0;
    profitAvg = parseFloat(document.querySelector('.profitavg').value) || 0;
    ml = parseFloat(document.querySelector('.ml').value) || 0;
    skill = parseFloat(document.querySelector('.skill').value) || 0;
    gtPrice = parseFloat(document.querySelector('.gtprice').value) || 0;
    imbue = parseFloat(document.querySelector('.imbue').value) || 0;
    stprice = parseFloat(document.querySelector('.sprice').value) || 0;
    st = parseFloat(document.querySelector('.st').value) || 0;

    let expLeft = parseFloat(targetExp - currentExp);
    let Hleft = expAvg !== 0 ? formatTime(expLeft / expAvg) : 0;
    let MlLeft = expAvg !== 0 ? parseFloat(ml * (expLeft / expAvg)) : 0;
    let SkillLeft = expAvg !== 0 ? parseFloat(skill * (expLeft / expAvg)) : 0;
    let DaysGreenStamina = expAvg !== 0 ? parseFloat((expLeft / expAvg) / 3) : 0;
    let HourlyImbueCost = expAvg !== 0 ? parseFloat((gtPrice * imbue) / 20) : 0;
    let stHour = parseFloat(st * stprice);

if (expLeft!=0) {
    addItemToCalcList('Exp left for target level: ' +expLeft)
}

if (Hleft!=0) {
    addItemToCalcList('Hours left for target level: '+formatTime(Hleft))
}
if (MlLeft!=0) {
    addItemToCalcList('Magic level you can get in the remaining time: '+MlLeft.toFixed(2))
}
if (SkillLeft!=0) {
    addItemToCalcList('Skill you can get in the remaining time: '+SkillLeft.toFixed(2))
}
if (DaysGreenStamina!=0) {
    addItemToCalcList('Days hunting with green stamina(3h): '+DaysGreenStamina.toFixed(2))
}
if (HourlyImbueCost!=0) {
    addItemToCalcList('Hourly Cost of Imbuements: '+HourlyImbueCost.toFixed(2) )
}
if (stHour!=0) {
    addItemToCalcList('Hourly Cost of silver tokens: '+stHour.toFixed(2))
}
}

function addExp(exp){
    currentExp+=exp;
    saveValues()
    fillCalculations()
}

//create li to fill calculations
function addItemToCalcList(itemText) {
        const calcList = document.querySelector('.calc');
        console.log('Adding item:', itemText);
        if (calcList) {
          const listItem = document.createElement('li');
          listItem.textContent = itemText;
          calcList.appendChild(listItem);
        } else {
          showFeedbackMessage('Error: Unable to find the calc list element.', 'error');
        }
      }

fillCalculations()

document.getElementById('setButton').addEventListener('click', function () {
  saveValues();
  fillCalculations();
});