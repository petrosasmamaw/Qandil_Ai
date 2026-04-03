#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${YELLOW}=== Qandil AI Chat Storage Setup Verification ===${NC}"
echo ""

# Check Backend Structure
echo "${YELLOW}Checking Backend Files...${NC}"

backend_files=(
  "backend/models/AIAssistanceChat.js"
  "backend/models/NotesChat.js"
  "backend/models/AssignmentGuideChat.js"
  "backend/models/ImageAnalyzerChat.js"
  "backend/controllers/AIAssistanceChatController.js"
  "backend/controllers/NotesChatController.js"
  "backend/controllers/AssignmentGuideChatController.js"
  "backend/controllers/ImageAnalyzerChatController.js"
  "backend/routes/aiAssistanceChatRoutes.js"
  "backend/routes/notesChatRoutes.js"
  "backend/routes/assignmentGuideChatRoutes.js"
  "backend/routes/imageAnalyzerChatRoutes.js"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file (MISSING)"
  fi
done

echo ""
echo "${YELLOW}Checking Frontend Redux Slices...${NC}"

frontend_slices=(
  "src/store/slices/aiAssistanceChatSlice.js"
  "src/store/slices/notesChatSlice.js"
  "src/store/slices/assignmentGuideChatSlice.js"
  "src/store/slices/imageAnalyzerChatSlice.js"
)

for slice in "${frontend_slices[@]}"; do
  if [ -f "$slice" ]; then
    echo -e "${GREEN}✓${NC} $slice"
  else
    echo -e "${RED}✗${NC} $slice (MISSING)"
  fi
done

echo ""
echo "${YELLOW}Checking Frontend Components...${NC}"

frontend_components=(
  "src/components/ChatHistory.jsx"
  "src/components/ChatIntegrationExample.jsx"
  "src/utils/chatService.js"
)

for component in "${frontend_components[@]}"; do
  if [ -f "$component" ]; then
    echo -e "${GREEN}✓${NC} $component"
  else
    echo -e "${RED}✗${NC} $component (MISSING)"
  fi
done

echo ""
echo "${YELLOW}Verification Complete!${NC}"
echo ""
echo "${YELLOW}Next Steps:${NC}"
echo "1. Start MongoDB"
echo "2. Run backend: cd backend && npm run dev"
echo "3. Verify backend is running at http://localhost:5000/api/health"
echo "4. Update your pages using the ChatIntegrationExample.jsx pattern"
echo "5. Test by sending a message on any page"
echo ""
echo "Refer to CHAT_STORAGE_SETUP.md for detailed implementation guide."
