#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Cleaning temporary files...${NC}"

# Remove node_modules
if [ -d "node_modules" ]; then
    echo -e "${RED}Removing node_modules...${NC}"
    rm -rf node_modules
fi

# Remove dist
if [ -d "dist" ]; then
    echo -e "${RED}Removing dist...${NC}"
    rm -rf dist
fi

# Remove .cache
if [ -d ".cache" ]; then
    echo -e "${RED}Removing .cache...${NC}"
    rm -rf .cache
fi

# Remove package-lock.json
if [ -f "package-lock.json" ]; then
    echo -e "${RED}Removing package-lock.json...${NC}"
    rm package-lock.json
fi

echo -e "${GREEN}Cleanup completed!${NC}"
echo -e "${GREEN}To reinstall dependencies, run: npm install${NC}"
