// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Form elements
const form = document.getElementById('productRequestForm');
const printBtn = document.getElementById('printBtn');
/* const pdfBtn = document.getElementById('pdfBtn'); */
/* const shareBtn = document.getElementById('shareBtn'); */
/* const excelBtn = document.getElementById('excelBtn'); */

// Form data state
let formData = {
    repFirstName: '',
    repLastName: '',
    repTitle: '',
    repPhone: '',
    repEmail: '',
    repDepartment: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    products: [
        { id: 1, name: 'Collagen Classic', quantity: 0 },
        { id: 2, name: 'Purple Collagen', quantity: 0 },
        { id: 3, name: '5x Çoklu Magnezyum', quantity: 0 },
        { id: 4, name: 'Bromelain', quantity: 0 },
        { id: 5, name: 'Cranberry', quantity: 0 },
        { id: 6, name: 'Multivitamin', quantity: 0 },
        { id: 7, name: 'Mind Focus', quantity: 0 },
        { id: 8, name: 'Postbiyotik', quantity: 0 }
    ]
};

// Update summary info in the right panel
function updateSummaryInfo() {
    const summaryPanel = document.getElementById('summaryPanel');
    if (!summaryPanel) return;

    // Get selected products
    const selectedProducts = formData.products.filter(product => product.quantity > 0);
    
    // Create summary HTML
    let summaryHTML = `
        <div class="p-4 bg-black-purple-100 rounded-lg mb-4">
            <h3 class="text-lg font-medium text-black-purple-700 mb-2">Form Özeti</h3>
            
            <div class="space-y-2 text-sm">
                ${formData.firstName || formData.lastName ? 
                    `<p><span class="font-medium">Alıcı:</span> ${formData.firstName} ${formData.lastName}</p>` : ''}
                
                ${formData.phone ? 
                    `<p><span class="font-medium">Telefon:</span> ${formData.phone}</p>` : ''}
                
                ${formData.address ? 
                    `<p><span class="font-medium">Adres:</span> ${formData.address}</p>` : ''}
                
                ${selectedProducts.length > 0 ? 
                    `<div class="mt-3">
                        <p class="font-medium">Seçilen Ürünler:</p>
                        <ul class="list-disc list-inside pl-2">
                            ${selectedProducts.map(product => 
                                `<li>${product.name} (${product.quantity} adet)</li>`).join('')}
                        </ul>
                    </div>` : 
                    '<p class="text-black-purple-500 italic">Henüz ürün seçilmedi</p>'}
                
                ${formData.description ? 
                    `<div class="mt-3">
                        <p class="font-medium">Açıklama:</p>
                        <p class="text-black-purple-600">${formData.description}</p>
                    </div>` : ''}
            </div>
        </div>
    `;
    
    summaryPanel.innerHTML = summaryHTML;
}

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load company representative data from localStorage
    const repFirstName = localStorage.getItem('repFirstName');
    const repLastName = localStorage.getItem('repLastName');
    const repPhone = localStorage.getItem('repPhone');
    const repEmail = localStorage.getItem('repEmail');
    const repDepartment = localStorage.getItem('repDepartment');
    const repTitle = localStorage.getItem('repTitle');
    
    // Update formData with localStorage values
    if (repFirstName) formData.repFirstName = repFirstName;
    if (repLastName) formData.repLastName = repLastName;
    if (repPhone) formData.repPhone = repPhone;
    if (repEmail) formData.repEmail = repEmail;
    if (repDepartment) formData.repDepartment = repDepartment;
    if (repTitle) formData.repTitle = repTitle;
    
    // Update form fields with localStorage values
    if (repFirstName) document.getElementById('repFirstName').value = repFirstName;
    if (repLastName) document.getElementById('repLastName').value = repLastName;
    if (repPhone) document.getElementById('repPhone').value = repPhone;
    if (repEmail) document.getElementById('repEmail').value = repEmail;
    if (repDepartment) document.getElementById('repDepartment').value = repDepartment;
    if (repTitle) document.getElementById('repTitle').value = repTitle;
    
    // Update summary panel
    updateSummaryInfo();
});

// Update form data when form changes
form.addEventListener('input', (e) => {
    const target = e.target;
    
    // Handle product quantities
    if (target.name && target.name.startsWith('product_') && target.name.endsWith('_quantity')) {
        const productIndex = parseInt(target.name.split('_')[1]) - 1;
        if (productIndex >= 0 && productIndex < formData.products.length) {
            formData.products[productIndex].quantity = parseInt(target.value) || 0;
        }
    } else {
        // Handle other form fields
        formData[target.name] = target.value;
        
        // Save company representative data to localStorage
        if (['repFirstName', 'repLastName', 'repPhone', 'repEmail', 'repDepartment', 'repTitle'].includes(target.name)) {
            localStorage.setItem(target.name, target.value);
        }
    }
    
    // Update summary panel
    updateSummaryInfo();
});

// Function to generate Excel and return the workbook
async function fillExcel() {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Ürün Talep Formu', {
        pageSetup: { paperSize: 9, orientation: 'portrait' } // A4 portrait
    });
    
    // Set column widths to match the new Sheet1.html
    worksheet.columns = [
        { width: 25 }, // A - ÜRÜN İSMİ
        { width: 10 }, // B - ADET
        { width: 15 }, // C - TUTAR
        { width: 15 }, // D - ALICI BİLGİLERİ
        { width: 15 }, // E
        { width: 15 }, // F
        { width: 15 }, // G
        { width: 15 }, // H
        { width: 15 }  // I
    ];
    
    // Logo and Title section (rows 1-4)
    // Leave column A empty for logo

    worksheet.mergeCells('B1:G4');
    const titleCell = worksheet.getCell('B1');
    titleCell.value = 'ÜRÜN TALEP FORMU';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Document info cells
    worksheet.getCell('H1').value = 'Doküman No';
    worksheet.getCell('H2').value = 'Yayın Tarihi';
    worksheet.getCell('H3').value = 'Revizyon No';
    worksheet.getCell('H4').value = 'Revize Tarihi';
    
    // Leave publication date empty as requested in todolist
    // worksheet.getCell('I2').value = new Date().toLocaleDateString('tr-TR');

    // PERSONEL BİLGİSİ section
    worksheet.mergeCells('A5:G5');
    worksheet.getCell('A5').value = 'PERSONEL BİLGİSİ';
    worksheet.getCell('A5').font = { size: 12, bold: true };
    worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.mergeCells('H5:I5');
    worksheet.getCell('H5').value = 'TARİH';
    worksheet.getCell('H5').font = { size: 12, bold: true };
    worksheet.getCell('H5').alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Personnel info rows
    worksheet.getCell('A6').value = 'AD SOYAD';
    worksheet.mergeCells('B6:G6');
    worksheet.getCell('B6').value = `${formData.repFirstName} ${formData.repLastName}`;
    worksheet.getCell('B6').alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.mergeCells('H6:I8');
    worksheet.getCell('H6').value = new Date().toLocaleDateString('tr-TR');
    worksheet.getCell('H6').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('H6').font = { bold: true };
    
    worksheet.getCell('A7').value = 'DEPARTMAN';
    worksheet.mergeCells('B7:G7');
    worksheet.getCell('B7').value = formData.repDepartment || '';
    worksheet.getCell('B7').alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.getCell('A8').value = 'ÜNVAN';
    worksheet.mergeCells('B8:G8');
    worksheet.getCell('B8').value = formData.repTitle || '';
    worksheet.getCell('B8').alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Products header row
    worksheet.getCell('A9').value = 'ÜRÜN İSMİ';
    worksheet.getCell('A9').font = { size: 12, bold: true };
    worksheet.getCell('A9').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('B9').value = 'ADET';
    worksheet.getCell('B9').font = { size: 12, bold: true };
    worksheet.getCell('B9').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell('C9').value = 'TUTAR';
    worksheet.getCell('C9').font = { size: 12, bold: true };
    worksheet.getCell('C9').alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.mergeCells('D9:I9');
    worksheet.getCell('D9').value = 'ALICI VE KARGO BİLGİLERİ';
    worksheet.getCell('D9').font = { size: 12, bold: true };
    worksheet.getCell('D9').alignment = { horizontal: 'center', vertical: 'middle' };

    // Product rows
    const productList = [
        { name: 'Collagen Classic', quantity: formData.products[0].quantity || '' },
        { name: 'Purple Collagen', quantity: formData.products[1].quantity || '' },
        { name: '5x Çoklu Magnezyum', quantity: formData.products[2].quantity || '' },
        { name: 'Bromelain', quantity: formData.products[3].quantity || '' },
        { name: 'Cranberry', quantity: formData.products[4].quantity || '' },
        { name: 'Multivitamin', quantity: formData.products[5].quantity || '' },
        { name: 'Mind Focus', quantity: formData.products[6].quantity || '' },
        { name: 'Postbiyotik', quantity: formData.products[7].quantity || '' },
        { name: 'Calm', quantity: '' },
        { name: 'Omega3', quantity: '' },
        { name: 'D3K2', quantity: '' }
    ];

    let rowIndex = 10;

    // First product row with recipient name
    worksheet.getCell(`A${rowIndex}`).value = productList[0].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[0].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.getCell(`D${rowIndex}`).value = 'ALICI AD';
            worksheet.mergeCells(`E${rowIndex}:I${rowIndex}`);
            worksheet.getCell(`E${rowIndex}`).value = formData.firstName;
    worksheet.getCell(`E${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    rowIndex++;

    // Second product row with recipient surname
    worksheet.getCell(`A${rowIndex}`).value = productList[1].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[1].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.getCell(`D${rowIndex}`).value = 'ALICI SOYAD';
            worksheet.mergeCells(`E${rowIndex}:I${rowIndex}`);
            worksheet.getCell(`E${rowIndex}`).value = formData.lastName;
    worksheet.getCell(`E${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    rowIndex++;

    // Third product row with recipient phone
    worksheet.getCell(`A${rowIndex}`).value = productList[2].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[2].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.getCell(`D${rowIndex}`).value = 'ALICI TELEFON';
            worksheet.mergeCells(`E${rowIndex}:I${rowIndex}`);
            worksheet.getCell(`E${rowIndex}`).value = formData.phone;
    worksheet.getCell(`E${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    rowIndex++;

    // Fourth product row with recipient address
    worksheet.getCell(`A${rowIndex}`).value = productList[3].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[3].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.getCell(`D${rowIndex}`).value = 'ALICI ADRES';
            worksheet.mergeCells(`E${rowIndex}:I${rowIndex+1}`);
            worksheet.getCell(`E${rowIndex}`).value = formData.address;
    worksheet.getCell(`E${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    rowIndex++;

    // Fifth product row (continuing address)
    worksheet.getCell(`A${rowIndex}`).value = productList[4].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[4].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    rowIndex++;

    // Sixth product row with TALEP AÇIKLAMASI header
    worksheet.getCell(`A${rowIndex}`).value = productList[5].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[5].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells(`D${rowIndex}:I${rowIndex}`);
    worksheet.getCell(`D${rowIndex}`).value = 'TALEP AÇIKLAMASI';
    worksheet.getCell(`D${rowIndex}`).font = { size: 12, bold: true };
    worksheet.getCell(`D${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
        
        rowIndex++;

    // Remaining product rows with description
    const descriptionRowStart = rowIndex;

    // Mind Focus row
    worksheet.getCell(`A${rowIndex}`).value = productList[6].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[6].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    rowIndex++;

    // Postbiyotik row
    worksheet.getCell(`A${rowIndex}`).value = productList[7].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[7].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    rowIndex++;

    // Calm row
    worksheet.getCell(`A${rowIndex}`).value = productList[8].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[8].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    rowIndex++;

    // Omega3 row
    worksheet.getCell(`A${rowIndex}`).value = productList[9].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[9].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    rowIndex++;

    // D3K2 row
    worksheet.getCell(`A${rowIndex}`).value = productList[10].name;
    worksheet.getCell(`B${rowIndex}`).value = productList[10].quantity;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    rowIndex++;

    // TOPLAM row
    worksheet.getCell(`A${rowIndex}`).value = 'TOPLAM';
    worksheet.getCell(`A${rowIndex}`).font = { size: 12, bold: true };
    worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getCell(`B${rowIndex}`).value = formData.products.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);
    worksheet.getCell(`B${rowIndex}`).font = { bold: true };
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

    // Merge cells for description area
    worksheet.mergeCells(`D${descriptionRowStart}:I${rowIndex-1}`);
    worksheet.getCell(`D${descriptionRowStart}`).value = formData.description || '';
    worksheet.getCell(`D${descriptionRowStart}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    rowIndex++;

    // KONTROL - ONAY row
    worksheet.mergeCells(`A${rowIndex}:I${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'KONTROL - ONAY';
    worksheet.getCell(`A${rowIndex}`).font = { size: 12, bold: true };
    worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    
    rowIndex++;

    // PAZARLAMA / MALİ İŞLER row
    worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'PAZARLAMA';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    worksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.mergeCells(`E${rowIndex}:I${rowIndex}`);
    worksheet.getCell(`E${rowIndex}`).value = 'MALİ İŞLER';
    worksheet.getCell(`E${rowIndex}`).font = { bold: true };
    worksheet.getCell(`E${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
    
    rowIndex++;

    // Signature space
    worksheet.mergeCells(`A${rowIndex}:D${rowIndex+2}`);
    worksheet.mergeCells(`E${rowIndex}:I${rowIndex+2}`);
    
    // Apply styles to all cells
    for (let row = 1; row <= rowIndex+2; row++) {
        for (let col = 1; col <= 9; col++) {
            const cell = worksheet.getCell(row, col);
            
            // Add borders to all cells
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            
            // If alignment not already set, set default alignment
            if (!cell.alignment) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }
        }
    }

    // Row heights to match the HTML template
    worksheet.getRow(1).height = 26;
    worksheet.getRow(2).height = 26;
    worksheet.getRow(3).height = 26;
    worksheet.getRow(4).height = 26;
    worksheet.getRow(5).height = 43;
    worksheet.getRow(6).height = 28;
    worksheet.getRow(7).height = 31;
    worksheet.getRow(8).height = 29;
    worksheet.getRow(9).height = 41;

    // Set consistent height for product rows
    for (let row = 10; row < rowIndex; row++) {
        worksheet.getRow(row).height = 39;
    }

    // Set the approval row height
    worksheet.getRow(rowIndex).height = 92;

    return workbook;
}

// Function to save Excel workbook
async function saveExcelWorkbook(workbook) {
    try {
        // Show loading state
        excelBtn.disabled = true;
        excelBtn.innerHTML = '<span class="material-icons-outlined animate-spin">autorenew</span> Yükleniyor...';
        
        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Generate filename
        let filename = 'urun-talep-formu.xlsx';
        if (formData.firstName && formData.lastName) {
            filename = `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-urun-talep-formu.xlsx`;
        }
        
        // Save the file using FileSaver.js
        saveAs(blob, filename);
        return { success: true };
    } catch (error) {
        console.error('Excel dosyası oluşturulurken hata:', error);
        alert('Excel dosyası oluşturulurken bir hata oluştu: ' + error.message);
        return { success: false, error };
    } finally {
        // Reset button state
        excelBtn.disabled = false;
        excelBtn.innerHTML = '<span class="material-icons-outlined">table_view</span> Excel Olarak Kaydet';
    }
}

// Function to convert Excel to PDF using PDF export library
async function convertExcelToPdf(workbook, options = {}) {
    try {
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.background = 'rgba(0, 0, 0, 0.7)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.borderRadius = '8px';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.innerHTML = '<div style="text-align:center;"><div style="font-size:24px;margin-bottom:10px;"><span class="material-icons-outlined" style="display:inline-block;animation:spin 2s linear infinite;">autorenew</span></div>PDF oluşturuluyor...</div>';
        document.body.appendChild(loadingMessage);
        
        // Generate filename based on user name if available
        let filename = 'urun-talep-formu';
        if (formData.firstName && formData.lastName) {
            filename = `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-urun-talep-formu`;
        }
        
        // For Excel option, use the existing Excel functionality
        if (options.excel) {
        // First, create the Excel file as a blob
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            document.body.removeChild(loadingMessage);
            saveAs(excelBlob, `${filename}.xlsx`);
            return { success: true };
        }
        
        try {
            // Load the urun-talep-formu.html template
            const response = await fetch('urun-talep-formu.html');
            if (!response.ok) {
                throw new Error('Template loading failed');
            }
            
            const templateHtml = await response.text();
            
            // Create a new window to render the template
            const printWindow = window.open('', '_blank', 'width=980,height=800');
            printWindow.document.write(templateHtml);
            printWindow.document.close();
            
            // Allow some time for the window to load
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get today's date in Turkish format
            const today = new Date();
            const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
            
            // Fill in the form data
            try {
                // Personnel Information
                printWindow.document.querySelector('input[name="ad_soyad"]').value = 
                    `${formData.repFirstName || ''} ${formData.repLastName || ''}`;
                printWindow.document.querySelector('input[name="departman"]').value = 
                    formData.repDepartment || '';
                printWindow.document.querySelector('input[name="unvan"]').value = 
                    formData.repTitle || '';
                
                // Date
                printWindow.document.querySelector('input[name="tarih"]').value = formattedDate;
                
                // Recipient Information
                printWindow.document.querySelector('input[name="alici_ad"]').value = 
                    formData.firstName || '';
                printWindow.document.querySelector('input[name="alici_soyad"]').value = 
                    formData.lastName || '';
                printWindow.document.querySelector('input[name="alici_telefon"]').value = 
                    formData.phone || '';
                printWindow.document.querySelector('textarea[name="alici_adres"]').value = 
                    formData.address || '';
                
                // Products
                let totalQuantity = 0;
                
                // Fill in product quantities
                formData.products.forEach((product, index) => {
                    const quantity = product.quantity;
                    totalQuantity += quantity;
                    
                    const fieldName = `adet_${product.id}`;
                    const quantityField = printWindow.document.querySelector(`input[name="${fieldName}"]`);
                    if (quantityField && quantity > 0) {
                        quantityField.value = quantity;
                    }
                });
                
                // Fill in total quantity
                if (totalQuantity > 0) {
                    printWindow.document.querySelector('input[name="toplam_adet"]').value = totalQuantity;
                }
                
                // Description
                printWindow.document.querySelector('textarea[name="talep_aciklamasi"]').value = 
                    formData.description || '';
                
                // Hide print button in the form when generating PDF
                const noPrintElements = printWindow.document.querySelectorAll('.no-print');
                noPrintElements.forEach(element => {
                    element.style.display = 'none';
                });
            } catch (err) {
                console.error('Form filling error:', err);
            }
            
            // If this is a print request
            if (options.print) {
                document.body.removeChild(loadingMessage);
                setTimeout(() => {
                    printWindow.print();
                    // Don't close the window after printing
                }, 500);
                return { success: true };
            }
            
            // For PDF generation or sharing
            // Wait for the form to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Create PDF using html2canvas and jsPDF
            const formElement = printWindow.document.getElementById('productRequestForm');
            
            if (!formElement) {
                throw new Error('Form element not found');
            }
            
            const canvas = await html2canvas(formElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 980
            });
            
            // Create a PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Add the form image to the PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const ratio = canvas.width / canvas.height;
            let imgWidth = pageWidth;
            let imgHeight = imgWidth / ratio;
            
            // Adjust if image is taller than the page
            if (imgHeight > pageHeight) {
                imgHeight = pageHeight;
                imgWidth = imgHeight * ratio;
            }
            
            // Position the image in the center of the page
            const x = (pageWidth - imgWidth) / 2;
            const y = 0;
            
            doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            
            // Close the print window
            printWindow.close();
        
        // Remove loading message
        document.body.removeChild(loadingMessage);
        
            if (options.share) {
                // For sharing, return the PDF blob
                return {
                    blob: doc.output('blob'),
                    filename: `${filename}.pdf`
                };
        } else {
                // For regular PDF save
                doc.save(`${filename}.pdf`);
            return { success: true };
            }
        } catch (error) {
            // Clean up
            document.body.removeChild(loadingMessage);
            throw error;
        }
    } catch (error) {
        console.error('PDF dönüştürme sırasında hata:', error);
        alert('PDF dönüştürme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        return { success: false, error };
    }
}

// Modify event listeners for buttons to use the Excel approach for all output types
printBtn.addEventListener('click', async () => {
    try {
        // First fill the Excel workbook with data
        const workbook = await fillExcel();
        
        // Then export to PDF and print
        await convertExcelToPdf(workbook, { print: true });
    } catch (error) {
        console.error('Yazdırma sırasında hata:', error);
        alert('Yazdırma sırasında bir hata oluştu.');
    }
});

/* pdfBtn.addEventListener('click', async () => {
    try {
        // First fill the Excel workbook with data
        const workbook = await fillExcel();
        
        // Then export to PDF
        await convertExcelToPdf(workbook, { pdf: true });
    } catch (error) {
        console.error('PDF oluşturma sırasında hata:', error);
        alert('PDF oluşturma sırasında bir hata oluştu.');
    }
}); */

/* shareBtn.addEventListener('click', async () => {
    try {
        // First fill the Excel workbook with data
        const workbook = await fillExcel();
        
        // Then prepare for sharing as PDF
        const result = await convertExcelToPdf(workbook, { share: true });
        
        if (result && result.blob) {
            // Use Web Share API if available
            if (navigator.share) {
                const file = new File([result.blob], result.filename, { type: 'application/pdf' });
                await navigator.share({
                    title: 'Ürün Talep Formu',
                    files: [file]
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const link = document.createElement('a');
                link.href = URL.createObjectURL(result.blob);
                link.download = result.filename;
                link.click();
            }
        }
    } catch (error) {
        console.error('Paylaşım sırasında hata:', error);
        alert('Paylaşım sırasında bir hata oluştu.');
    }
}); */

/* excelBtn.addEventListener('click', async () => {
    try {
        // Fill the Excel workbook with data
        const workbook = await fillExcel();
        
        // Save as Excel with the excel option
        await convertExcelToPdf(workbook, { excel: true });
    } catch (error) {
        console.error('Excel oluşturma sırasında hata:', error);
        alert('Excel oluşturma sırasında bir hata oluştu.');
    }
}); */