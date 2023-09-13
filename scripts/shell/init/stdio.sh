#!/bin/bash

NO_COL='\033[0m'
WHITE_COL='\033[1;37m'
GREEN_COL='\033[0;32m'
RED_COL='\033[0;31m'
CYAN_COL='\033[0;36m'
PURPLE_COL='\033[0;35m'

# Prints an error message to the terminal in the color white
gb_message(){
  printf "${PURPLE_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints a message to the terminal in all green
gb_message_green(){
  printf "${GREEN_COL}$@${NO_COL}\n"
}

# Prints an error message to the terminal in the color white
gb_info(){
  printf "${CYAN_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints an success message to the terminal in the color green
gb_success(){
  printf "${GREEN_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints an error message to the terminal in the color red
gb_error(){
  printf "\n${RED_COL}[GOBLET] - $@${NO_COL}\n\n"
}

# Asks a question in the terminal
gb_question(){
  read -p "" INPUT;
  local ANSWER="${INPUT}"

  echo "$ANSWER"
}
