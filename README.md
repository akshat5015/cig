EventSphere – AI Powered Event & Media Management Platform
Overview

EventSphere is a cloud-based Event and Media Management Platform designed for clubs, societies, and organizations to efficiently manage event media.

The platform provides centralized storage, AI-powered media discovery, social interaction features, cloud integration, and secure access control.

Instead of scattered Google Drive folders and personal storage systems, EventSphere offers a single platform where users can upload, organize, search, and interact with event photos and videos.

Problem Statement

Clubs and organizations generate large volumes of media during:

Workshops
Cultural Fests
Competitions
Trips
Photoshoots
Club Activities

Managing this content becomes difficult because:

Media is scattered across multiple locations
Search and discovery are inefficient
Access control is missing
Personal photo discovery is difficult
No intelligent tagging exists

EventSphere addresses these challenges through AI-powered media management and cloud infrastructure.

Key Features
Event Management
Create Events
Event Categories
Public/Private Events
Event-wise Albums
Event Metadata Management
Media Management
Photo Upload
Video Upload
Bulk Upload
Drag and Drop Upload
Media Preview
Cloud Storage
Authentication & Access Control
JWT Authentication
Role Based Access Control

Roles:

Admin
Photographer
Club Member
Viewer
Social Features
Like Photos
Comment on Media
Download Media
Add to Favorites
Notifications
AI Features
Smart Image Tagging

AWS Rekognition automatically generates tags such as:

Crowd
Person
Building
Sports
Beach
Nature
Facial Recognition

Users can:

Upload a selfie
Search all event photos
View personalized matching photos
Cloud Integration

AWS S3 used for:

Image Storage
Video Storage
Media Scalability

AWS Rekognition used for:

Image Tagging
Face Detection
Face Matching
Watermarking

Dynamic watermark generation during downloads using:

Club Name
Event Name
User Role
Technology Stack
Frontend
Next.js
TypeScript
Tailwind CSS
Backend
FastAPI
SQLAlchemy
Database
PostgreSQL
Cloud
AWS S3
AWS Rekognition
Containerization
Docker


System Architecture
Users
   |
Next.js Frontend
   |
FastAPI Backend
   |
--------------------------------
|              |              |
PostgreSQL    AWS S3    AWS Rekognition
(Database)   (Storage)     (AI)

Database Design

Tables:

users
events
media
tags
likes
comments
favorites
notifications

Relationships:
Users
 |
 | 1:N
 |
Events
 |
 | 1:N
 |
Media
 |
 |---- Tags
 |
 |---- Likes
 |
 |---- Comments
 |
 |---- Favorites

Notifications -> Users


API Documentation

FastAPI automatically generates API documentation.

Available endpoints include:

Authentication APIs
Event APIs
Media APIs
Search APIs
AI APIs
Social Interaction APIs

Swagger Documentation:
  /backend/docs


Deployment

Frontend:
http://localhost:3000

Backend:
http://0.0.0.0:8000

Future Enhancements
Infinite Scrolling Gallery
QR Album Sharing
Collaborative Albums
Story Feature
AI Generated Captions
Analytics Dashboard
Progressive Web App
Offline Support
Duplicate Image Detection
Image Moderation
