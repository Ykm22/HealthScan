from models.ResNet import ResNet18
import torch
import os

def get_ad_model(save_path):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    AD_model = ResNet18(device, 2)
    AD_model.conv1 = torch.nn.Conv2d(8, AD_model.conv1.out_channels, kernel_size=AD_model.conv1.kernel_size, stride=AD_model.conv1.stride, padding=AD_model.conv1.padding, bias=AD_model.conv1.bias)
    AD_model.fc2 = torch.nn.Linear(in_features=AD_model.fc2.in_features, out_features=2, bias=True)
    AD_model.to(device)
    AD_model.eval()

    if os.path.exists(save_path):
        checkpoint = torch.load(save_path)
        AD_model.load_state_dict(checkpoint['model_state_dict'])  

    return AD_model
