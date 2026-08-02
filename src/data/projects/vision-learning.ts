import type { Project } from '@/data/types';

/**
 * Visionary — interactive computer vision teaching site.
 * Source: the adihebbalae/vision-learning-site repo (public, not deployed yet).
 */
const visionLearning: Project = {
  slug: 'vision-learning',
  title: 'Visionary',

  tagline: {
    recruiter:
      'An interactive site that teaches computer vision by letting you operate the math.',
    builder:
      'Four browser modules for the parts of a CNN that a diagram cannot get across.',
  },

  summary: {
    recruiter:
      'Visionary teaches computer vision through four modules you drive yourself: a 32×32 image you inspect pixel by pixel, a convolution playground with selectable 3×3 kernels, a saliency overlay on a slider, and a training run you advance one epoch at a time. Each one is tied to a specific CIFAR-10 classifier, dogs against roads, so the visuals explain a real model instead of CNNs in general. Built with Next.js, TypeScript and Tailwind, and the source is public.',
    builder:
      'I had already written the classifier. Explaining it to someone who had never seen a convolution kept failing in the same place: I could say that a small grid of numbers slides across the image and sums products at every position, and the sentence would land as vocabulary rather than as a picture. So I stopped trying to write a better sentence and built the thing you hover over instead. Four modules, one of which computes the real operation live while the other three stage their data to make the shape of the idea visible.',
  },

  role: 'Solo design and build',
  period: 'Feb 2026',
  status: 'complete',
  depth: 'full',
  category: ['ML/AI', 'Interactive', 'Web App'],

  tech: [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'Framer Motion',
    'SVG',
  ],

  metrics: [
    { value: '4', label: 'Interactive modules: pixel matrix, convolution, saliency, training' },
    { value: '3,072', label: 'Numbers in the 32×32 RGB image the network actually sees' },
    { value: '3×3', label: 'Kernel window, convolved live in the browser as you hover' },
    { value: '30', label: 'Training epochs you step through one click at a time' },
  ],

  links: {
    github: 'https://github.com/adihebbalae/vision-learning-site',
  },

  sections: [
    {
      heading: 'What each module does',
      body:
        'The pixel matrix opens with a 32×32 image and nothing else. Hovering a cell reads out its row, its column and its three channel values, and shows the color those three numbers make. The panel beside it does the arithmetic the reader is meant to leave with: 1,024 pixels, 3,072 numbers, and that is the entire input the network ever sees.\n\n' +
        'The filter playground puts an 8×8 input on the left, a 3×3 kernel in the middle and the resulting feature map on the right. Hovering a cell in the input dims everything outside the window under the kernel and scales up the single output cell that window produces. Four kernels are selectable, edge detection through to identity, and switching between them recomputes the whole map.\n\n' +
        'The saliency module stacks the same image twice, once plain and once under a heat overlay, with a slider that runs the overlay from invisible to opaque. Sweeping it is the point. The reader controls how much of the original they can still see, which is the question a saliency map is really asking.\n\n' +
        'The training simulator steps through 30 epochs on a button. Each press adds a point to two SVG charts, accuracy and loss, with training and validation plotted separately, a dashed line at 50% to mark chance, and a marker on the best validation epoch so far. Stepping rather than animating is deliberate: an epoch is a discrete event, and a reader who has clicked 30 times has counted them.',
    },
    {
      heading: 'Why convolution is hard to explain',
      body:
        'A kernel is three things at once. It is a small grid of numbers. It is an operation applied at every position of a larger grid. And in a trained network it is a parameter, learned rather than chosen. Prose has to introduce those one at a time, and by the third the reader has usually lost the first.\n\n' +
        'The module can hold two of them together. Binding the hover position to both grids puts the window and the single number it produces on screen at the same instant, so “slides across” stops being a phrase and becomes something the reader is doing with a mouse.\n\n' +
        'The third sense is the one the module does not solve. Named kernels like edge detection and sharpen are a scaffold: they make the operation legible, and they quietly teach that a filter is something a person picks. In the classifier this site is built on, the numbers in those grids started random and were learned. The panel at the bottom of the module prints the architecture it came from, Conv2D(32) → Conv2D(32) → pool → Conv2D(64) → Conv2D(64) → pool → Dense(512) → 2 outputs, which at least makes the count visible. Dozens of filters, stacked in layers, none of them picked by hand.',
    },
    {
      heading: 'Where the numbers are real and where they are staged',
      body:
        'The convolution is real arithmetic. Every output cell is computed in the browser from the input grid and the selected kernel, summed over the 3×3 window, divided by nine in the blur case and clamped to 0–255. Change the kernel and the map recomputes from scratch.\n\n' +
        'The other three modules generate their data. The image is drawn procedurally in bands (sky, face, body, ground) with noise on each channel. The saliency values fall off with distance from a fixed point near the center. The epoch curves come from an exponential with a small random term, shaped to look like the run they stand in for, which is why that module calls itself a simulator on screen.\n\n' +
        'That was a deliberate trade. Real CIFAR-10 tensors and a real training loop would have meant shipping model weights and a runtime to a page whose job is about ninety seconds of intuition. The cost is that those numbers are illustrative, and the page has to say so. The accuracy figure the simulator reports is not a result anyone should cite.',
    },
    {
      heading: 'What I would build next',
      body:
        'The obvious missing module is an editable kernel: nine input boxes, live recomputation, and a prompt to guess what a given set of numbers will do before you release it. That is the step from “filters detect edges” to “filters are parameters”, and it is the step this version skips.\n\n' +
        'The second gap is that nothing on the page asks the reader to predict anything. Every module reveals its answer the moment it is touched. A version that withheld the output cell until the reader guessed high or low would teach more per screen, at the cost of feeling less immediately satisfying.\n\n' +
        'The site is not deployed yet. It runs locally, and the source is public.',
    },
  ],
};

export default visionLearning;
