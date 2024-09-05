import numpy as np
import nibabel as nib
import torch

input_shapes = {
    (256, 256, 166) : 128,
}

def read_image(path):
    input_img = nib.load(path).get_fdata()
    return input_img

def min_max_normalize(image, new_min=0, new_max=1):
    min_val = np.min(image)
    max_val = np.max(image)
    normalized_image = (image - min_val) / (max_val - min_val) * (new_max - new_min) + new_min
    return normalized_image

def separate_coronal_slices_around(img, slice_number, slices_count):
    slices = []
    for slice_no in range(slice_number - slices_count, slice_number + slices_count):
        slice = np.rot90(img[:, slice_no, :], k=2)
        slice = min_max_normalize(slice)
        slices.append(slice) # coronal
    return slices

def input_process(img, age, sex, device):
    coronal_slices = separate_coronal_slices_around(img, input_shapes[img.shape], 4)
    coronal_slices = torch.tensor(coronal_slices, dtype=torch.float).to(device)

    x = coronal_slices.unsqueeze(0)
    y = torch.tensor((sex, age)).unsqueeze(0).to(device)

    return x, y
