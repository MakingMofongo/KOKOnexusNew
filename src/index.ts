import { showWelcomeMessage, showMainMenu } from './cli/interface';

async function main() {
  try {
    await showWelcomeMessage();
    await showMainMenu();
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();