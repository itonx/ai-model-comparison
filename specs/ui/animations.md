# Search Animations (Top Left)

## Animation: “Expandable Search + Focus Glow”

On focus, smoothly expand the input width by 10–15%, increase height slightly, and apply a soft glowing border with a subtle shadow. Animate the placeholder text sliding from left to right and fading in. When focus is lost, revert smoothly. Add a search icon that slightly rotates (5–10 degrees) and scales up when focused.

## Animation: “Typing Pulse Feedback”

Add a typing animation effect to the search bar: while the user is typing, show a subtle animated underline that moves like a wave or gradient shimmer. Stop the animation 500ms after the user stops typing.

# Tool Selection Animation (Sidebar Tools)

## Animation: “Active Tool Highlight Slide”

In the sidebar tool list, implement an animated active indicator. When a tool is selected, animate a rounded highlight background sliding smoothly to the selected item (like a floating pill). The selected item should slightly scale up (1.03) and increase brightness. Previously selected tool should fade back to normal.

## Animation: “Tool Button Press + Ripple”

Add a ripple click animation on sidebar tool buttons. On click, generate a circular ripple that expands outward and fades. Also add a press-down scale effect (scale to 0.97 for 100ms) then bounce back.

# Tool Content Transition (Main Panel)

## Animation: “Slide + Fade Content Swap”

When switching tools, animate the tool content area. The old content should slide left (20px) and fade out. The new content should slide in from the right (30px) while fading in. Add a slight stagger: title appears first, then the sections below appear with 80ms delay each.

## Animation: “Content Skeleton Loader”

When switching tools, show a skeleton loading animation for the tool content area for ~300ms. Skeleton blocks should have a shimmering gradient animation. After loading, crossfade into the real content.

# Output / Result Animation (for tools in general when apply)

## Animation: “Result Pop-In”

When output is generated, animate the output text area with a smooth pop-in effect: scale from 0.98 to 1.0 and fade in. Add a subtle highlight flash behind the output for 300ms.

## Animation: “Copy Confirmation Animation”

Implement a copy-to-clipboard animation: when clicking the copy button, morph the icon into a checkmark, briefly flash the button background, and show a toast notification that slides up from the bottom and fades out after 2 seconds.

# Sidebar Hover Animations for Tools

## Hover “Lift + Glow”

Add hover animation to sidebar tool items: on hover, slightly lift the item (translateY(-2px)), increase background brightness, and apply a soft glowing border and shadow. Smooth transition 200ms with ease-out.

## Hover “Icon Pop + Rotate”

On sidebar tool hover, animate the tool icon by scaling to 1.1 and rotating 5 degrees. Add smooth easing and return to normal when hover ends.

## Hover “Text Slide-In / Emphasis”

When hovering a sidebar tool item, animate the label text to slide 6px to the right and increase font weight slightly. Also fade in a small accent line to the left of the text.

## Hover “Left Accent Bar Fill”

Add a hover accent indicator: a thin vertical bar on the left side of the tool item should animate from height 0% to 100% when hovered, then collapse back when hover ends.

# Page Load Animation (First Impression Matters)

## Animation: “Layout Reveal”

On initial page load, animate the UI layout: sidebar slides in from the left with fade-in, tool content fades in after 150ms, and search bar appears last with a small downward slide. Use smooth easing.

# Micro Interaction: Scroll Animation (Tool Content)

## Animation: “Scroll Progress Indicator”

Add a scroll progress indicator at the top of the tool content area. The bar should smoothly expand horizontally as the user scrolls down, with easing.

# “Premium” Feature

## Animation: “Animated Gradient Background”

Add a subtle animated gradient background to the main content area. The gradient should slowly shift position over 10–15 seconds, creating a calm ambient motion. Ensure it is low contrast and does not distract from text.
