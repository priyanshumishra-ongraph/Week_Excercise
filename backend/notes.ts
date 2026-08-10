import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

interface Note {
  title: string;
  body: string;
  createdAt: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_FILE = path.join(__dirname, 'notes.json');

async function getNotes(): Promise<Note[]> {
  try {
    const data = await fs.readFile(NOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw new Error(`Error reading notes: ${error.message}`);
  }
}

async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
  } catch (error: any) {
    throw new Error(`Error saving notes: ${error.message}`);
  }
}

async function addNote(title?: string, body?: string): Promise<void> {
  if (!title || !body) {
    console.error('Error: Title and body are required to add a note.');
    console.log('Usage: npx tsx notes.ts add "Title" "Body"');
    process.exit(1);
  }

  try {
    const notes = await getNotes();
    
    if (notes.find(n => n.title.toLowerCase() === title.toLowerCase())) {
      console.error(`Error: Note with title "${title}" already exists!`);
      process.exit(1);
    }

    notes.push({ title, body, createdAt: new Date().toISOString() });
    await saveNotes(notes);
    console.log(`Success: Note "${title}" added successfully.`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

async function listNotes(): Promise<void> {
  try {
    const notes = await getNotes();
    if (notes.length === 0) {
      console.log('No notes found. Try adding one!');
      return;
    }
    
    console.log('--- Your Notes ---');
    notes.forEach((note, index) => {
      console.log(`\n[${index + 1}] ${note.title}`);
      console.log(`    ${note.body}`);
    });
    console.log('\n------------------');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

async function deleteNote(title?: string): Promise<void> {
  if (!title) {
    console.error('Error: Title is required to delete a note.');
    console.log('Usage: npx tsx notes.ts delete "Title"');
    process.exit(1);
  }

  try {
    const notes = await getNotes();
    const updatedNotes = notes.filter(n => n.title.toLowerCase() !== title.toLowerCase());

    if (notes.length === updatedNotes.length) {
      console.error(`Error: Note with title "${title}" not found.`);
      process.exit(1);
    }

    await saveNotes(updatedNotes);
    console.log(`Success: Note "${title}" deleted.`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

const command = process.argv[2];
const title = process.argv[3];
const body = process.argv[4];

switch (command) {
  case 'add':
    addNote(title, body);
    break;
  case 'list':
    listNotes();
    break;
  case 'delete':
  case 'remove':
    deleteNote(title);
    break;
  default:
    console.log('CLI Note Tool');
    console.log('Usage:');
    console.log('  npx tsx notes.ts add "Title" "Body content"');
    console.log('  npx tsx notes.ts list');
    console.log('  npx tsx notes.ts delete "Title"');
    break;
}
