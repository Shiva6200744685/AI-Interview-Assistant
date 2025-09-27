import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import mammoth from 'mammoth';

/**
 * Extract text content from PDF file
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

/**
 * Extract text content from DOCX file
 * @param {File} file - DOCX file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

/**
 * Extract candidate information from text using regex patterns
 * @param {string} text - Extracted text from resume
 * @returns {Object} - Parsed candidate information
 */
export const parseCandidateInfo = (text) => {
  const info = {
    name: null,
    email: null,
    phone: null,
  };

  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Phone regex (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+91[-.\s]?)?[0-9]{10}|(?:\+91[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    info.phone = phoneMatch[0].replace(/\D/g, ''); // Remove non-digits
  }

  // Name extraction (usually appears at the beginning or after specific keywords)
  const namePatterns = [
    /^([A-Z][a-z]+ [A-Z][a-z]+)/m, // First line with two capitalized words
    /Name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /^([A-Z][A-Z\s]+)$/m, // All caps name
  ];

  for (const pattern of namePatterns) {
    const nameMatch = text.match(pattern);
    if (nameMatch && nameMatch[1]) {
      info.name = nameMatch[1].trim();
      break;
    }
  }

  // If no name found, try to extract from common resume patterns
  if (!info.name) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 5 && line.length < 50 && /^[A-Za-z\s]+$/.test(line)) {
        const words = line.split(' ');
        if (words.length >= 2 && words.length <= 4) {
          info.name = line;
          break;
        }
      }
    }
  }

  return info;
};

/**
 * Process uploaded resume file and extract candidate information
 * @param {File} file - Resume file (PDF or DOCX)
 * @returns {Promise<Object>} - Parsed candidate information
 */
export const processResumeFile = async (file) => {
  try {
    let extractedText = '';
    
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      extractedText = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX files only.');
    }

    if (!extractedText.trim()) {
      throw new Error('No text content found in the resume file.');
    }

    const candidateInfo = parseCandidateInfo(extractedText);
    
    return {
      ...candidateInfo,
      originalText: extractedText,
      fileName: file.name,
      fileSize: file.size,
      lastModified: file.lastModified,
    };
  } catch (error) {
    console.error('Error processing resume file:', error);
    throw error;
  }
};

/**
 * Validate file before processing
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export const validateResumeFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.pdf', '.docx'];

  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidType = allowedTypes.includes(file.type.toLowerCase());

  if (!hasValidExtension && !hasValidType) {
    return { isValid: false, error: 'Please upload a PDF or DOCX file' };
  }

  return { isValid: true };
};