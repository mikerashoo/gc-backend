#!/bin/bash

# Paths
BACKEND_PRISMA_TYPES="../getway-games-api/node_modules/@prisma/client"
BACKEND_EXTENDED_TYPES="../getway-games-api/src/utils/extended-types"
SHARED_TYPES_DIR="../getway-api-shared-types/prisma"
SHARED_TYPES_EXTENDED_DIR="../getway-api-shared-types/extended-types"

# Create the shared types directory if it doesn't exist
mkdir -p $SHARED_TYPES_DIR
mkdir -p $SHARED_TYPES_EXTENDED_DIR

# Copy the generated Prisma types to the shared types directory
cp -r $BACKEND_PRISMA_TYPES/* $SHARED_TYPES_DIR/

# Copy the extended types to the shared types directory
cp -r $BACKEND_EXTENDED_TYPES/* $SHARED_TYPES_EXTENDED_DIR/
