#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}NestJS REST Starter — Project Setup${NC}\n"

read -rp "Project name (kebab-case, e.g. my-api): " PROJECT_NAME
read -rp "Description: " PROJECT_DESCRIPTION
read -rp "Author: " PROJECT_AUTHOR

if [[ ! "$PROJECT_NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: project name must be lowercase kebab-case (e.g. my-api)" >&2
  exit 1
fi

echo -e "\n${GREEN}→ Updating package.json${NC}"
node -e "
  const fs = require('fs');
  const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  p.name = process.argv[1];
  p.description = process.argv[2];
  p.author = process.argv[3];
  p.version = '0.1.0';
  fs.writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');
" "$PROJECT_NAME" "$PROJECT_DESCRIPTION" "$PROJECT_AUTHOR"

echo -e "${GREEN}→ Updating README.md${NC}"
node -e "
  const fs = require('fs');
  let readme = fs.readFileSync('README.md', 'utf8');
  readme = readme.replace(/^# .+$/m, '# ' + process.argv[1]);
  readme = readme.replace(/^A production-ready NestJS REST API starter[^\n]*/m, process.argv[2]);
  fs.writeFileSync('README.md', readme);
" "$PROJECT_NAME" "$PROJECT_DESCRIPTION"

if [ ! -f .env ]; then
  echo -e "${GREEN}→ Creating .env from .env.example${NC}"
  cp .env.example .env
  node -e "
    const fs = require('fs');
    let env = fs.readFileSync('.env', 'utf8');
    env = env.replace(/^APP_NAME=.*/m, \"APP_NAME='\" + process.argv[1] + \"'\");
    env = env.replace(/^APP_DESCRIPTION=.*/m, \"APP_DESCRIPTION='\" + process.argv[2] + \"'\");
    fs.writeFileSync('.env', env);
  " "$PROJECT_NAME" "$PROJECT_DESCRIPTION"
  echo -e "${YELLOW}  Remember to update JWT_SECRET and DB credentials in .env${NC}"
else
  echo -e "${YELLOW}→ .env already exists, skipping${NC}"
fi

if command -v gh &>/dev/null && git remote get-url origin &>/dev/null 2>&1; then
  read -rp "Update GitHub repo description? (y/N): " UPDATE_GH
  if [[ "${UPDATE_GH,,}" == "y" ]]; then
    gh repo edit --description "$PROJECT_DESCRIPTION"
    echo -e "${GREEN}→ GitHub repo updated${NC}"
  fi
fi

read -rp "Reset git history for a clean start? (y/N): " RESET_GIT
if [[ "${RESET_GIT,,}" == "y" ]]; then
  echo -e "${GREEN}→ Resetting git history${NC}"
  rm -rf .git
  git init
  git add .
  git commit -m "chore: initial commit"
  echo -e "${GREEN}→ Fresh git history created${NC}"
fi

echo -e "\n${GREEN}Done! Project '${PROJECT_NAME}' is ready.${NC}\n"
echo "Next steps:"
echo "  1. Edit .env with your configuration"
echo "  2. Run 'make docker-up' to start the database"
echo "  3. Run 'make dev' to start the development server"
