# ImageCarouselReact
Author: Akileng Isaac, Flock of Birds

Type: Widget
Latest Version: 1.0
Package file name: ImageCarouselReact.mpk

## Description

Displays images in a carousel either static or dynamic images

## Typical usage scenario

* Displays images in a carousel

## Features and limitations

* Static and dynamic images.
* Use navigation controls to move images
* Auto slide of images based on an Interval
* Onclick event to images to call microflow or open page
* Height and width configurations

## Installation

See the general instructions under _Configuration._

## Dependencies

* Mendix 6 environment. Tested on 6.8.0

## Properties
* Data Source
  * Entity; The entity with the images to display
  * Source; Type of source could be XPath, Microflow or Static
  * Caption; Based on attribute, caption shown on image
  * Description; Based on attribute, description shown on image
* Source - XPath
  * Constraint; Constraint to image entity
* Source - Microflow
  * Data Source Microflow; Returns images for carousel
* Source - Static
  * Images To Display
     - Data Source
        - Image Caption; Caption shown on image
        - Image Description; Description shown on image
        - Image/Picture; Image to display on carousel
     - Behavior
        - On Click; what action to execute when image is clicked
        - Call Microflow; Microflow to execute when image is clicked
        - Open Page; Page to open when image is clicked
* Carousel
  * Navigators; Show or hide navigators
  * Indicators; Index of image in the carousel shown by the dots
  * Interval; Duration of image transitions
  * Pause On Hover: Pause image transitions on hover
  * Slide Images; Move through images by sliding them
* Appearance
  * Width; Width of the carousel
  * WidthUnits; Measurement for width percent,pixels or auto
  * Height; Height of the carousel
  * HeightUnits; Measurement for Height percent,pixels or auto
* Behavior
  * On Click; What action to execute when image is clicked
  * Call Microflow; Microflow to execute when image is clicked
  * Open Page; Page to open when image is clicked

Source and [Sample project](https://github.com/mendixlabs/carousel/tree/master/test) at GitHub

Please contribute fixes and extensions at https://github.com/mendixlabs/carousel



## Known bugs

* None so far; please let me know when there are any issues or suggestions.
