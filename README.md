# For all your growing needs

Ok, this plugin needs some explanation. It's not something you might use out of the box. As the name suggest, it "growFrom" or "shrinkTo" a DOM element from/into another using CSS3 transform properties.

So the process is like this, you need to already have two elements on the browser, and this plugin will make a smooth animation (transition) from one to the other.

Let's say you have a 'source' element (perhaps a link) and a target element (perhaps a pop up layer). So this example code:

    $("#target").growFrom($("#source"));

Will slowly "grow" the #target from the #source using CSS transforms and not the "width" and "height" DOM properties.


## Why not use the width and height properties?

Animating the width and height properties is fine for simple elements that do not push much work on the browser to re-flow and render on each tick of the animation. Imagine a layer div full of text or with a form, if you animate over the size properties of the element, the browser must re-render all the elements inside the div in each tick of the animation, so the result is not as smooth as it should be.

## Usage

Read the source code for instructions. You will also find some interesting functions in the source. Basically you need to:

- Have a source element that triggers the animation. Perhaps an image from a carrousel or a simple link. A big element like a thumbnail works best.
- Have something to show as a result of this source element. Perhaps a popup layer or an image zoom or something.

See the index.html for some demos.

Also, look into demo/index.html for a tweaked version of FancyBox.

## Requirements

* A browser with CSS3 transform support (!/msie[0-8]+/)
* This plugin is for jQuery. Tested on jQuery 1.4 and 1.5, but I think on older versions will work too.

## TODO

In future revisions we hope to drop those -moz-, -webkit-, -o- selectors. :-)

It will be also nice to convert the current implementation using the .animate jQuery function into pure CSS animations. Currently this would be only possible with Webkit based browsers, and Chrome has a know bug that produces some annoying flicker with CSS3 animations.

---

Read LICENSE file for the license, which basically says: do what you want. :-) (But please, do not forget to include a mention)

Oh! and please, forking and contributing is encouraged.
