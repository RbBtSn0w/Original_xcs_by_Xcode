#!/bin/bash
# Author: rbbtsn0w
# Date: 2023/05/30
# use: show all module info in current directory

# Bash Debug model
# set -x


# define log path
readonly log_file="module_info.log"

# clean log file
> "$log_file"



function module_cmd_in_subDir() {

    local module_dir_name=$1
    local module_bin_name=$2
    local module_cmd=$3
    local sub_dir_path=$4

    if [ ! -d "$sub_dir_path" ]; then
        echo "Not find $module_dir_name in $sub_dir_path" >> "$log_file"
        return 1
    fi

    local module_inner_path="/xcs/$module_dir_name/bin"

    if [ ! -d "$sub_dir_path$module_inner_path" ]; then

        module_inner_path="/xcs/$module_dir_name/sbin"

        if [ ! -d "$sub_dir_path$module_inner_path" ]; then
            echo "Not find $module_dir_name in $sub_dir_path" >> "$log_file"
            return 1
        fi
    fi

    # echo "-------------------$module_dir_name-------------------"

    # Get the path to the bin executable
    local module_path="$sub_dir_path$module_inner_path/$module_bin_name"
    # Get the version of the module

    local result=$($module_path $module_cmd 2>&1 | head -n 1)

    # local result=$($module_path $module_cmd 2>&1 | head -n 1 > /tmp/output.log)

    local sub_dir_name="$(basename "$sub_dir_path")"
    # Print the result
    # echo "In $sub_dir_name  module: $module_dir_name bin: $module_bin_name version: $result"
    # use printf to format the output
    printf "%-15s module: %-10s bin: %-10s version: %s \n" "In $sub_dir_name" "$module_dir_name" "$module_bin_name" "${result}" >> "$log_file"
}

# Get the current directory
readonly base_dir=$(pwd)

function show_module() {

    # Loop through all sub directories
    for sub_dir in $(ls "$base_dir"); do
        # Get the full path of the sub directory
        local sub_dir_path="$base_dir/$sub_dir"
        if [ -d "$sub_dir_path" ]; then
            module_cmd_in_subDir $1 $2 $3 "$sub_dir_path"
        fi
    done
}


# define module name
modules=("Node" "Redis" "Nginx" "CouchDB")
# define module binary name
module_binaryName_list=("node" "redis-server" "nginx" "couchdb")
# define module cmd
module_cmd_list=("-v" "-v" "-v" "-V")


for index in "${!modules[@]}"; do
    module=${modules[$index]}
  echo "-------------------$module-------------------" >> "$log_file"
  module_binaryName="${module_binaryName_list[$index]}"
  module_cmd="${module_cmd_list[$index]}"
  show_module "$module" "$module_binaryName" "$module_cmd"
done


# echo "-------------------Node-------------------" >> "$log_file"
# show_module "Node" "node" "-v"

# echo "-------------------Redis-------------------" >> "$log_file"
# show_module "Redis" "redis-server" "-v"

# echo "-------------------Nginx-------------------" >> "$log_file"
# show_module "Nginx" "nginx" "-v"

# echo "-------------------CouchDB-------------------" >> "$log_file"
# show_module "CouchDB" "couchdb" "-V"



cat module_info.log